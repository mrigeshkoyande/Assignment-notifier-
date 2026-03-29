"""
MCP Tool: Link Analyzer Tool
Analyzes URLs for phishing indicators, suspicious redirects, and malicious patterns.
"""
import re
from urllib.parse import urlparse

KNOWN_PHISHING_DOMAINS = [
    "kyc-upd8.xyz", "bit.ly/upihlp", "secure-upi-verify.com",
    "paytm-prize-claim.in", "phonepe-cashback-now.com",
    "sbi-kyc-update.net", "hdfc-reward-claim.xyz",
    "fakebank.in", "googlepay-win.xyz",
]
SUSPICIOUS_TLD = [".xyz", ".club", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".top"]
URL_SHORTENERS = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "rb.gy"]
PHISHING_KEYWORDS = [
    "kyc", "verify", "update", "expire", "suspend", "prize",
    "winner", "claim", "reward", "urgent", "login", "secure",
    "account", "confirm",
]


def analyze_link(url: str) -> dict:
    """
    Analyses a URL for phishing/malicious indicators.
    Used by Scam Intelligence Agent.
    """
    risk_score = 0
    flags = []

    try:
        parsed = urlparse(url if url.startswith("http") else "http://" + url)
        domain = parsed.netloc.lower()
        path   = parsed.path.lower()
    except Exception:
        return {"url": url, "risk_score": 100, "is_suspicious": True,
                "flags": ["Invalid URL format"], "verdict": "MALICIOUS"}

    # Check known phishing domains
    for phishing in KNOWN_PHISHING_DOMAINS:
        if phishing in domain:
            risk_score += 80
            flags.append(f"Known phishing domain: {phishing}")

    # Check URL shorteners (often mask malicious destinations)
    for shortener in URL_SHORTENERS:
        if shortener in domain:
            risk_score += 30
            flags.append(f"URL shortener used: {shortener}")

    # Check suspicious TLDs
    for tld in SUSPICIOUS_TLD:
        if domain.endswith(tld):
            risk_score += 25
            flags.append(f"Suspicious TLD: {tld}")

    # Check for banking/payment keywords in non-official domains
    official_domains = ["paytm.com", "phonepe.com", "googlepay.com",
                        "sbi.co.in", "hdfcbank.com", "icicibank.com",
                        "axisbank.com", "razorpay.com", "npci.org.in"]
    is_official = any(off in domain for off in official_domains)
    if not is_official:
        for kw in PHISHING_KEYWORDS:
            if kw in domain or kw in path:
                risk_score += 10
                flags.append(f"Phishing keyword in URL: '{kw}'")

    # Check HTTP vs HTTPS
    if not url.startswith("https"):
        risk_score += 15
        flags.append("Non-HTTPS connection (insecure)")

    # Check for IP-based URL (no domain name)
    if re.match(r"https?://\d+\.\d+\.\d+\.\d+", url):
        risk_score += 40
        flags.append("IP-based URL (no domain name)")

    # Check excessive subdomains
    subdomains = domain.split(".")
    if len(subdomains) > 4:
        risk_score += 15
        flags.append(f"Excessive subdomains: {domain}")

    risk_score = min(risk_score, 100)

    verdict = "SAFE"
    if risk_score >= 70:
        verdict = "MALICIOUS"
    elif risk_score >= 35:
        verdict = "SUSPICIOUS"

    return {
        "url": url,
        "domain": domain,
        "risk_score": risk_score,
        "is_suspicious": risk_score >= 35,
        "flags": flags,
        "verdict": verdict,
    }


async def analyze_links(urls: list) -> list:
    """Analyze multiple links."""
    return [analyze_link(url) for url in urls]
