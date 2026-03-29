"""
MCP Tool: Transaction History Tool
Fetches user transaction patterns and behavioral baselines.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.database.db import get_user_transactions
from datetime import datetime
import statistics


async def get_transaction_history(upi_id: str) -> dict:
    """
    Fetches transaction history and computes behavioral baseline for a UPI ID.
    Used by the Transaction Risk Agent.
    """
    txns = await get_user_transactions(upi_id, limit=50)

    if not txns:
        return {
            "found": False,
            "upi_id": upi_id,
            "transaction_count": 0,
            "avg_amount": 0,
            "max_amount": 0,
            "known_receivers": [],
            "typical_hours": [],
            "typical_locations": [],
            "fraud_history": False,
        }

    amounts = [t["amount"] for t in txns]
    receivers = list(set(t["receiver_upi"] for t in txns))
    locations = list(set(t["location"] for t in txns if t.get("location")))
    fraud_history = any(t["is_fraud"] for t in txns)

    hours = []
    for t in txns:
        try:
            dt = datetime.fromisoformat(t["timestamp"])
            hours.append(dt.hour)
        except Exception:
            pass

    return {
        "found": True,
        "upi_id": upi_id,
        "transaction_count": len(txns),
        "avg_amount": round(statistics.mean(amounts), 2),
        "max_amount": max(amounts),
        "std_amount": round(statistics.stdev(amounts), 2) if len(amounts) > 1 else 0,
        "known_receivers": receivers[:10],
        "typical_hours": sorted(list(set(hours))),
        "typical_locations": locations,
        "fraud_history": fraud_history,
        "recent_transactions": txns[:5],
    }
