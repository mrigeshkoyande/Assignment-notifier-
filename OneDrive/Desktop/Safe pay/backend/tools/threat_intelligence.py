"""
MCP Tool: Threat Intelligence Tool
Checks UPI IDs, phone numbers, emails against the known scam database.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.database.db import check_threat

# In-memory patterns for fast checks (complements the DB)
SUSPICIOUS_KEYWORDS = [
    "prize", "winner", "lucky", "lottery", "reward", "claim",
    "urgent", "expire", "suspend", "block", "helpdesk", "care",
    "refund", "cashback", "customer", "support", "verify",
]
KNOWN_SCAM_DOMAINS = [
    "fakebank", "kyc-upd8", "secure-upi", "upi-help",
    "paytm-prize", "phonepe-reward", "googlepay-win",
]


async def check_threat_intelligence(indicator: str, indicator_type: str = "UPI_ID") -> dict:
    """
    Checks an indicator (UPI ID / phone / url / email) against threat intelligence DB.
    Used by Scam Intelligence Agent.
    """
    # Check DB first
    result = await check_threat(indicator)
    if result:
        return {
            "found": True,
            "indicator": indicator,
            "threat_level": result["threat_level"],
            "scam_type": result["scam_type"],
            "description": result["description"],
            "report_count": result["report_count"],
            "source": "threat_database",
        }

    # Heuristic checks
    lower = indicator.lower()
    suspicious_score = 0
    matched_keywords = []

    for kw in SUSPICIOUS_KEYWORDS:
        if kw in lower:
            suspicious_score += 15
            matched_keywords.append(kw)

    for domain in KNOWN_SCAM_DOMAINS:
        if domain in lower:
            suspicious_score += 40
            matched_keywords.append(domain)

    threat_level = "SAFE"
    if suspicious_score >= 40:
        threat_level = "HIGH"
    elif suspicious_score >= 20:
        threat_level = "MEDIUM"
    elif suspicious_score >= 10:
        threat_level = "LOW"

    return {
        "found": threat_level != "SAFE",
        "indicator": indicator,
        "threat_level": threat_level,
        "scam_type": "SUSPICIOUS_PATTERN" if matched_keywords else None,
        "description": f"Matched suspicious keywords: {matched_keywords}" if matched_keywords else "No known threats",
        "report_count": 0,
        "source": "heuristic",
        "matched_keywords": matched_keywords,
    }
