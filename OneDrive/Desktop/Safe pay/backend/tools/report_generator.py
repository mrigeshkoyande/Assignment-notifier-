"""
MCP Tool: Report Generator Tool
Generates structured fraud complaint reports for RBI / Cybercrime portals.
"""
from datetime import datetime


async def generate_fraud_report(
    incident_id: str,
    transaction_id: str,
    reported_by: str,
    amount_lost: float,
    description: str,
    ai_analysis: dict = None,
) -> dict:
    """
    Generates a comprehensive fraud complaint report.
    Used by Recovery Agent.
    """
    now = datetime.utcnow()

    report = {
        "report_id": incident_id,
        "generated_at": now.isoformat(),
        "complainant_upi": reported_by,
        "transaction_id": transaction_id,
        "amount_lost": amount_lost,
        "incident_description": description,
        "ai_risk_assessment": ai_analysis or {},
        "complaint_text": _generate_complaint_text(
            incident_id, transaction_id, reported_by, amount_lost, description, now
        ),
        "file_with": [
            {
                "portal": "Cybercrime National Portal",
                "url": "https://cybercrime.gov.in",
                "helpline": "1930",
            },
            {
                "portal": "RBI Ombudsman",
                "url": "https://rbi.org.in/Scripts/Complaints.aspx",
                "helpline": "14448",
            },
            {
                "portal": "NPCI UPI Helpdesk",
                "url": "https://www.npci.org.in",
                "email": "upi@npci.org.in",
            },
        ],
    }

    recovery_steps = [
        "📞 Call your bank's 24/7 fraud helpline immediately to block your account",
        "🚫 File a complaint at cybercrime.gov.in or call National Cybercrime Helpline 1930",
        "📋 Submit this auto-generated report to your bank's nearest branch",
        "🔒 Change your UPI PIN and banking passwords immediately",
        "📱 Enable two-factor authentication on all banking apps",
        "💳 Request your bank to issue a new debit/credit card",
        "📊 Monitor your account statements for any further suspicious activity",
        "🏛️ If unresolved in 30 days, escalate to RBI Banking Ombudsman",
    ]

    return {"report": report, "recovery_steps": recovery_steps}


def _generate_complaint_text(incident_id, txn_id, upi, amount, description, dt):
    return f"""FRAUD COMPLAINT REPORT
======================
Report ID     : {incident_id}
Date & Time   : {dt.strftime("%d %B %Y, %H:%M UTC")}
Complainant   : {upi}
Transaction ID: {txn_id or "N/A"}
Amount Lost   : ₹{amount:,.2f}

INCIDENT DESCRIPTION:
{description}

This complaint was generated automatically by Safe-Pay AI, an AI-powered fraud
detection system. All evidence has been logged and is available for investigation.

Please treat this as an URGENT matter and initiate reversal proceedings immediately
as per RBI circular on online fraud recovery (RBI/2022-23/89).

Signature: Safe-Pay AI System | Powered by Google Gemini
"""
