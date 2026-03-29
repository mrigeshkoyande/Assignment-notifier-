"""
Demo Scenarios — Safe-Pay AI
Pre-built scenarios for hackathon demonstration.
GET /api/demo/1  |  /api/demo/2  |  /api/demo/3
"""

SCENARIOS = {
    1: {
        "name": "✅ Normal Payment",
        "description": "Regular payment to a known contact — safe transaction",
        "type": "transaction",
        "data": {
            "sender_upi": "rahul@upi",
            "receiver_upi": "priya@upi",
            "receiver_name": "Priya Patel",
            "amount": 500.0,
            "device_id": "device_rahul_001",
            "location": "Mumbai, MH",
            "note": "Coffee",
        },
        "expected_decision": "ALLOW",
    },
    2: {
        "name": "🚫 Fraud Attempt",
        "description": "Large payment to flagged UPI ID at unusual hour from unknown device",
        "type": "transaction",
        "data": {
            "sender_upi": "rahul@upi",
            "receiver_upi": "9999999999@paytm",
            "receiver_name": "Raj Kumar",
            "amount": 49999.0,
            "device_id": "device_unknown_xyz",
            "location": "Delhi, DL",
            "note": "Investment returns",
        },
        "expected_decision": "BLOCK",
    },
    3: {
        "name": "⚠️ Scam Message",
        "description": "Phishing SMS with urgency manipulation and suspicious link",
        "type": "message",
        "data": {
            "message": (
                "URGENT: Your SBI account KYC is expiring today! "
                "Your account will be BLOCKED immediately. "
                "Click here to update now: http://kyc-upd8.xyz/sbi-verify "
                "Share your OTP to confirm. — SBI Customer Care"
            ),
            "sender": "SBI-BANK",
            "links": ["http://kyc-upd8.xyz/sbi-verify"],
        },
        "expected_decision": "BLOCK",
    },
}


def get_scenario(scenario_id: int) -> dict | None:
    """Return a demo scenario by ID (1, 2, or 3), or None if not found."""
    return SCENARIOS.get(scenario_id)
