"""
MCP Tool: Bank Action Tool
Simulates bank API calls for blocking transactions and freezing accounts.
"""
import uuid
from datetime import datetime


SIMULATED_BANK_RESPONSES = {
    "BLOCK_TRANSACTION": {
        "success": True,
        "message": "Transaction hold placed successfully",
        "reference": None,
        "bank": "Safe-Pay Partner Banks",
        "action_time": None,
        "note": "Transaction blocked pending fraud investigation. Funds will be returned within 3-5 business days if confirmed fraudulent.",
    },
    "FREEZE_ACCOUNT": {
        "success": True,
        "message": "Account temporarily frozen for security review",
        "reference": None,
        "bank": "Safe-Pay Partner Banks",
        "action_time": None,
        "note": "Account access restricted. Call your bank helpline to verify identity and restore access.",
    },
    "ALERT_BANK": {
        "success": True,
        "message": "Fraud alert sent to bank risk team",
        "reference": None,
        "bank": "Safe-Pay Partner Banks",
        "action_time": None,
        "note": "Bank's fraud team has been notified and will contact you within 24 hours.",
    },
}


async def execute_bank_action(action_type: str, transaction_id: str = None, upi_id: str = None) -> dict:
    """
    Simulates a bank API action (block/freeze/alert).
    Used by Recovery Agent.

    action_type: BLOCK_TRANSACTION | FREEZE_ACCOUNT | ALERT_BANK
    """
    if action_type not in SIMULATED_BANK_RESPONSES:
        return {"success": False, "message": f"Unknown action: {action_type}"}

    response = SIMULATED_BANK_RESPONSES[action_type].copy()
    response["reference"] = f"REF{uuid.uuid4().hex[:8].upper()}"
    response["action_time"] = datetime.utcnow().isoformat()
    response["transaction_id"] = transaction_id
    response["upi_id"] = upi_id
    response["action_type"] = action_type

    return response
