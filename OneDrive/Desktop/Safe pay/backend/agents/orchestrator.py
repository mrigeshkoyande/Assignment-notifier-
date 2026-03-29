"""
Agent Orchestrator — Safe-Pay AI
Multi-agent pipeline: Risk → Scam Intel → Decision → Explanation

Uses Google genai SDK directly (compatible with google-genai package).
Falls back to deterministic logic if no API key is configured.
"""
import os
import json
import asyncio
import time
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
USE_GEMINI = bool(GOOGLE_API_KEY and GOOGLE_API_KEY != "your_google_ai_studio_api_key_here")

# Lazy-init Gemini client
_gemini_client = None

def _get_gemini():
    global _gemini_client
    if _gemini_client is None and USE_GEMINI:
        try:
            from google import genai
            _gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
        except Exception:
            pass
    return _gemini_client


async def _call_gemini(prompt: str, system: str = "") -> str:
    """Call Gemini asynchronously; returns text response."""
    client = _get_gemini()
    if client is None:
        return ""
    try:
        from google.genai import types
        resp = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system,
                max_output_tokens=512,
                temperature=0.2,
            ),
        )
        return resp.text or ""
    except Exception as e:
        print(f"[Gemini] Error: {e}")
        return ""


# ─────────────────────────────────────────────────────────
#  AGENT 1 — Transaction Risk Agent
# ─────────────────────────────────────────────────────────
async def transaction_risk_agent(transaction: dict, history: dict) -> dict:
    """
    Analyses transaction against user history and returns a risk score 0-100.
    """
    risk_score = 0
    risk_factors = []

    amount = transaction.get("amount", 0)
    avg_amount = history.get("avg_amount", 0)
    max_amount = history.get("max_amount", 0)
    receiver = transaction.get("receiver_upi", "")
    known_receivers = history.get("known_receivers", [])
    tx_hour = datetime.utcnow().hour
    typical_hours = history.get("typical_hours", list(range(8, 22)))
    typical_locations = history.get("typical_locations", [])
    location = transaction.get("location", "")
    txn_count = history.get("transaction_count", 0)

    # --- Rule-based scoring ---
    # New receiver
    if receiver not in known_receivers:
        risk_score += 25
        risk_factors.append({"factor": "New Receiver", "severity": "MEDIUM",
                              "detail": f"{receiver} is not in your transaction history"})

    # Amount significantly above average
    if avg_amount > 0 and amount > avg_amount * 3:
        risk_score += 30
        risk_factors.append({"factor": "Unusual Amount", "severity": "HIGH",
                              "detail": f"₹{amount} is {round(amount/avg_amount,1)}x your average of ₹{avg_amount}"})
    elif avg_amount > 0 and amount > avg_amount * 1.5:
        risk_score += 10
        risk_factors.append({"factor": "Above Average Amount", "severity": "LOW",
                              "detail": f"₹{amount} is higher than your usual ₹{avg_amount}"})

    # Odd hours
    if typical_hours and tx_hour not in typical_hours and (tx_hour < 6 or tx_hour > 23):
        risk_score += 20
        risk_factors.append({"factor": "Odd Transaction Hour", "severity": "MEDIUM",
                              "detail": f"Transaction at {tx_hour}:00 — outside your usual payment hours"})

    # New location
    if typical_locations and location and location not in typical_locations:
        risk_score += 15
        risk_factors.append({"factor": "New Location", "severity": "MEDIUM",
                              "detail": f"Transaction from '{location}' — not your usual location"})

    # First-time user (no history)
    if txn_count == 0:
        risk_score += 10
        risk_factors.append({"factor": "New Account", "severity": "LOW",
                              "detail": "No prior transaction history found for this UPI ID"})

    # Previous fraud
    if history.get("fraud_history"):
        risk_score += 15
        risk_factors.append({"factor": "Prior Fraud History", "severity": "HIGH",
                              "detail": "Previous fraudulent activity detected on this account"})

    # Large round-number amount (common in scams)
    if amount >= 10000 and amount % 1000 == 0:
        risk_score += 8
        risk_factors.append({"factor": "Round Number Amount", "severity": "LOW",
                              "detail": "Round-number large amounts are common in scam payments"})

    risk_score = min(int(risk_score), 100)

    # --- Gemini enhancement ---
    if USE_GEMINI and risk_score > 20:
        prompt = f"""Transaction analysis:
Amount: ₹{amount}
Receiver: {receiver} ({'known' if receiver in known_receivers else 'UNKNOWN'})
User avg amount: ₹{avg_amount}
Risk factors detected: {[r['factor'] for r in risk_factors]}

As a fraud detection AI, provide a brief (1 sentence) additional insight about this transaction risk. Be concise and specific."""
        gemini_insight = await _call_gemini(prompt, "You are a UPI fraud detection expert. Be brief and factual.")
        if gemini_insight:
            risk_factors.append({
                "factor": "AI Deep Analysis",
                "severity": "MEDIUM" if risk_score < 60 else "HIGH",
                "detail": gemini_insight.strip()
            })

    return {
        "agent": "Transaction Risk Agent",
        "risk_score": risk_score,
        "risk_factors": risk_factors,
    }


# ─────────────────────────────────────────────────────────
#  AGENT 2 — Scam Intelligence Agent
# ─────────────────────────────────────────────────────────
SCAM_PATTERNS = {
    "urgency": ["immediately", "urgent", "asap", "right now", "expire", "suspended",
                "blocked", "limited time", "act now", "do not delay"],
    "lottery": ["won", "winner", "prize", "lottery", "lucky draw", "congratulations",
                "selected", "reward", "free gift"],
    "impersonation": ["rbi", "sbi", "hdfc", "icici", "axis", "paytm", "phonepe",
                      "google pay", "police", "court", "income tax", "customs"],
    "social_engineering": ["otp", "cvv", "pin", "password", "share screen",
                           "remote access", "anydesk", "teamviewer"],
    "refund_scam": ["refund", "cashback", "reversal", "send small amount",
                    "confirm", "verify by sending"],
}


async def scam_intelligence_agent(message: str, sender: str, links: list, threat_data: dict) -> dict:
    """
    Detects phishing, social engineering, and scam patterns in messages.
    """
    scam_score = 0
    detected_patterns = []
    flagged_links = []
    message_lower = message.lower()

    # Pattern matching
    for pattern_type, keywords in SCAM_PATTERNS.items():
        found = [kw for kw in keywords if kw in message_lower]
        if found:
            score_boost = {"urgency": 25, "lottery": 30, "impersonation": 35,
                           "social_engineering": 40, "refund_scam": 30}.get(pattern_type, 20)
            scam_score += score_boost
            detected_patterns.append(f"{pattern_type.replace('_', ' ').title()} Pattern ({', '.join(found[:3])})")

    # Threat intelligence check
    if threat_data and threat_data.get("found"):
        scam_score += 30
        detected_patterns.append(f"Known Threat: {threat_data.get('scam_type', 'FLAGGED')}")

    # Link analysis
    from backend.tools.link_analyzer import analyze_link
    for link in links:
        link_result = analyze_link(link)
        if link_result["is_suspicious"]:
            scam_score += link_result["risk_score"] * 0.4
            flagged_links.append(link)
            detected_patterns.append(f"Suspicious URL: {link_result['verdict']} ({link})")

    scam_score = min(int(scam_score), 100)
    scam_type = None
    if detected_patterns:
        if any("Lottery" in p or "Prize" in p for p in detected_patterns):
            scam_type = "LOTTERY_SCAM"
        elif any("Impersonation" in p for p in detected_patterns):
            scam_type = "IMPERSONATION"
        elif any("Social Engineering" in p for p in detected_patterns):
            scam_type = "SOCIAL_ENGINEERING"
        elif any("Refund" in p for p in detected_patterns):
            scam_type = "REFUND_SCAM"
        elif any("Suspicious URL" in p for p in detected_patterns):
            scam_type = "PHISHING"
        else:
            scam_type = "SUSPICIOUS"

    # Gemini reasoning for complex analysis
    if USE_GEMINI and message:
        prompt = f"""Analyze this message for fraud/scam indicators:
Message: "{message}"
Sender: {sender}
Already detected: {detected_patterns}

Is this a scam? Provide 1 sentence explanation. Be specific about the manipulation tactic used."""
        gemini_analysis = await _call_gemini(
            prompt,
            "You are a cybersecurity expert specializing in SMS/WhatsApp fraud detection for Indian users. Be concise."
        )
        if gemini_analysis:
            detected_patterns.append(f"AI Analysis: {gemini_analysis.strip()}")

    return {
        "agent": "Scam Intelligence Agent",
        "scam_score": scam_score,
        "is_scam": scam_score >= 40,
        "scam_type": scam_type,
        "detected_patterns": detected_patterns,
        "flagged_links": flagged_links,
    }


# ─────────────────────────────────────────────────────────
#  AGENT 3 — Decision Agent
# ─────────────────────────────────────────────────────────
async def decision_agent(risk_score: int, scam_score: int, threat_data: dict) -> dict:
    """
    Combines all signals and makes the final ALLOW / WARN / BLOCK decision.
    """
    combined_score = max(risk_score, scam_score)
    threat_boost = 0
    if threat_data and threat_data.get("found"):
        level = threat_data.get("threat_level", "LOW")
        threat_boost = {"CRITICAL": 40, "HIGH": 25, "MEDIUM": 15, "LOW": 5}.get(level, 0)
    combined_score = min(combined_score + threat_boost, 100)

    if combined_score >= 70:
        decision = "BLOCK"
        decision_color = "red"
        confidence = "HIGH" if combined_score >= 85 else "MEDIUM"
    elif combined_score >= 40:
        decision = "WARN"
        decision_color = "amber"
        confidence = "MEDIUM"
    else:
        decision = "ALLOW"
        decision_color = "green"
        confidence = "HIGH"

    return {
        "agent": "Decision Agent",
        "decision": decision,
        "decision_color": decision_color,
        "combined_score": combined_score,
        "confidence": confidence,
    }


# ─────────────────────────────────────────────────────────
#  AGENT 4 — Explanation Agent
# ─────────────────────────────────────────────────────────
async def explanation_agent(
    decision: str,
    risk_factors: list,
    scam_patterns: list,
    combined_score: int,
    transaction: dict = None,
) -> str:
    """
    Generates a clear, user-friendly explanation of the decision.
    Uses Gemini for natural language generation; fallback is rule-based.
    """
    if USE_GEMINI:
        factors_text = "\n".join(f"- {r['factor']}: {r['detail']}" for r in risk_factors[:4])
        scam_text = "\n".join(f"- {p}" for p in scam_patterns[:3]) if scam_patterns else "None"
        prompt = f"""You are Safe-Pay AI explaining a payment decision to an Indian user.

Decision: {decision}
Risk Score: {combined_score}/100
Risk Factors:
{factors_text}

Scam Patterns:
{scam_text}

Write a clear, friendly explanation (2-3 sentences) telling the user WHY this decision was made. 
Use simple language. Start with the decision reason. Do NOT use markdown or bullet points. 
Example style: "This transaction was blocked because the receiver is not in your contact history and the amount of ₹49,999 is 8x higher than your usual payments. Additionally, this UPI ID has been reported in 47 fraud cases."
"""
        result = await _call_gemini(
            prompt,
            "You are Safe-Pay AI, a friendly fraud protection assistant for Indian UPI users."
        )
        if result and len(result) > 20:
            return result.strip()

    # Deterministic fallback
    parts = []
    if decision == "BLOCK":
        parts.append("⛔ This transaction has been BLOCKED to protect you from potential fraud.")
    elif decision == "WARN":
        parts.append("⚠️ This transaction has been flagged — please review carefully before proceeding.")
    else:
        parts.append("✅ This transaction appears safe based on your payment history.")

    for rf in risk_factors[:2]:
        parts.append(rf["detail"])

    if scam_patterns:
        parts.append(f"Detected: {scam_patterns[0]}")

    return " ".join(parts)


# ─────────────────────────────────────────────────────────
#  AGENT 5 — Recovery Agent
# ─────────────────────────────────────────────────────────
async def recovery_agent(incident_id: str, transaction_id: str, reported_by: str,
                          amount_lost: float, description: str, ai_analysis: dict) -> dict:
    """
    Generates recovery plan and triggers simulated bank actions.
    """
    from backend.tools.bank_action import execute_bank_action
    from backend.tools.report_generator import generate_fraud_report

    # Trigger bank actions in parallel
    block_result, report_data = await asyncio.gather(
        execute_bank_action("BLOCK_TRANSACTION", transaction_id, reported_by),
        generate_fraud_report(incident_id, transaction_id, reported_by, amount_lost, description, ai_analysis),
    )

    recovery_steps = report_data["recovery_steps"]

    if USE_GEMINI:
        prompt = f"""A UPI fraud victim needs recovery guidance.
Lost: ₹{amount_lost}
Description: {description}
Bank action: {block_result.get('message')}

Add 1 specific additional recovery tip relevant to this case (1 sentence only)."""
        extra_tip = await _call_gemini(prompt, "You are a financial fraud recovery expert for India.")
        if extra_tip:
            recovery_steps.insert(1, f"🤖 AI Tip: {extra_tip.strip()}")

    return {
        "agent": "Recovery Agent",
        "incident_id": incident_id,
        "bank_action": block_result,
        "report": report_data["report"],
        "recovery_steps": recovery_steps,
        "status": "REPORTED",
    }


# ─────────────────────────────────────────────────────────
#  AGENT 6 — Learning Agent
# ─────────────────────────────────────────────────────────
async def learning_agent(event_type: str, data: dict, feedback: str = None):
    """
    Logs incidents to the learning memory for continuous improvement.
    """
    from backend.database.db import save_learning_event
    await save_learning_event(event_type, {**data, "feedback": feedback})
    return {"agent": "Learning Agent", "logged": True, "event_type": event_type}


# ─────────────────────────────────────────────────────────
#  MAIN ORCHESTRATOR
# ─────────────────────────────────────────────────────────
async def analyze_transaction_pipeline(transaction: dict) -> dict:
    """
    Full multi-agent pipeline for transaction analysis.
    Detect → Reason → Explain → Prevent
    """
    start = time.time()
    txn_id = transaction.get("id") or f"txn_{uuid.uuid4().hex[:8]}"
    transaction["id"] = txn_id

    from backend.tools.transaction_history import get_transaction_history
    from backend.tools.threat_intelligence import check_threat_intelligence

    # Fetch context (tools)
    history, threat_data = await asyncio.gather(
        get_transaction_history(transaction.get("sender_upi", "")),
        check_threat_intelligence(transaction.get("receiver_upi", "")),
    )

    # Agent 1 & 2 run in parallel
    risk_result, scam_result = await asyncio.gather(
        transaction_risk_agent(transaction, history),
        scam_intelligence_agent("", "", [], threat_data),
    )

    # Agent 3 — Decision
    decision_result = await decision_agent(
        risk_result["risk_score"],
        scam_result["scam_score"],
        threat_data,
    )

    # Agent 4 — Explanation
    explanation = await explanation_agent(
        decision_result["decision"],
        risk_result["risk_factors"],
        scam_result["detected_patterns"],
        decision_result["combined_score"],
        transaction,
    )

    # Agent 6 — Learning (fire-and-forget)
    asyncio.create_task(learning_agent("TRANSACTION_ANALYZED", {
        "txn_id": txn_id,
        "decision": decision_result["decision"],
        "risk_score": decision_result["combined_score"],
    }))

    elapsed_ms = round((time.time() - start) * 1000, 1)

    return {
        "transaction_id": txn_id,
        "risk_score": decision_result["combined_score"],
        "decision": decision_result["decision"],
        "decision_color": decision_result["decision_color"],
        "explanation": explanation,
        "risk_factors": risk_result["risk_factors"],
        "scam_patterns": scam_result["detected_patterns"],
        "recommended_action": _recommended_action(decision_result["decision"]),
        "processing_time_ms": elapsed_ms,
        "agent_trace": [
            {"agent": "Transaction Risk Agent", "score": risk_result["risk_score"]},
            {"agent": "Scam Intelligence Agent", "score": scam_result["scam_score"]},
            {"agent": "Decision Agent", "decision": decision_result["decision"],
             "confidence": decision_result["confidence"]},
            {"agent": "Explanation Agent", "status": "completed"},
        ],
        "gemini_powered": USE_GEMINI,
    }


async def analyze_message_pipeline(message: str, sender: str, links: list) -> dict:
    """
    Pipeline for scam message analysis.
    """
    from backend.tools.threat_intelligence import check_threat_intelligence

    # Check sender against threat DB
    threat_data = await check_threat_intelligence(sender)

    # Agent 2 — Scam Intelligence
    scam_result = await scam_intelligence_agent(message, sender, links, threat_data)

    # Agent 4 — Generate explanation
    explanation = await explanation_agent(
        "BLOCK" if scam_result["is_scam"] else "WARN",
        [],
        scam_result["detected_patterns"],
        scam_result["scam_score"],
    )

    asyncio.create_task(learning_agent("MESSAGE_ANALYZED", {
        "sender": sender,
        "is_scam": scam_result["is_scam"],
        "scam_score": scam_result["scam_score"],
    }))

    return {
        "is_scam": scam_result["is_scam"],
        "scam_probability": scam_result["scam_score"],
        "scam_type": scam_result["scam_type"],
        "detected_patterns": scam_result["detected_patterns"],
        "explanation": explanation,
        "recommended_action": "Do NOT click any links or share OTP/PIN. Report to cybercrime.gov.in" if scam_result["is_scam"] else "Message appears safe. Stay alert.",
        "flagged_links": scam_result["flagged_links"],
    }


def _recommended_action(decision: str) -> str:
    return {
        "ALLOW": "Transaction is safe to proceed.",
        "WARN": "Verify receiver identity before sending. Contact them via a known number.",
        "BLOCK": "Do NOT proceed. Contact your bank immediately if already sent.",
    }.get(decision, "")
