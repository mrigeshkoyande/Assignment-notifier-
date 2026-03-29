"""
Safe-Pay AI — API Routes
All endpoints for transaction analysis, scam detection, fraud reporting, and dashboard.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend.api.models import (
    TransactionRequest, MessageAnalysisRequest, FraudReportRequest,
    AnalysisResponse, MessageAnalysisResponse, FraudReportResponse,
)
from backend.agents.orchestrator import (
    analyze_transaction_pipeline,
    analyze_message_pipeline,
    recovery_agent,
    learning_agent,
)
from backend.database.db import (
    save_transaction, get_all_transactions, get_dashboard_stats,
    get_all_alerts, get_fraud_incidents, save_fraud_incident,
)
from backend.simulator.scenarios import get_scenario

router = APIRouter()


# ─────────────────────────────────────────────────
#  Transaction Analysis
# ─────────────────────────────────────────────────
@router.post("/analyze_transaction", response_model=AnalysisResponse)
async def analyze_transaction(req: TransactionRequest):
    """Analyze a payment transaction through the full multi-agent pipeline."""
    txn_dict = req.model_dump()
    txn_dict["timestamp"] = txn_dict.get("timestamp") or datetime.utcnow().isoformat()

    result = await analyze_transaction_pipeline(txn_dict)

    # Persist to DB with all required fields
    await save_transaction({
        "id": result["transaction_id"],
        "sender_upi": req.sender_upi,
        "receiver_upi": req.receiver_upi,
        "receiver_name": req.receiver_name,
        "amount": req.amount,
        "timestamp": txn_dict["timestamp"],
        "device_id": req.device_id or "unknown",
        "location": req.location or "Unknown",
        "risk_score": result["risk_score"],
        "decision": result["decision"],
        "explanation": result["explanation"],
        "status": "COMPLETED",
        "is_fraud": 1 if result["decision"] == "BLOCK" else 0,
    })

    return AnalysisResponse(**result)


# ─────────────────────────────────────────────────
#  Message / SMS Scam Scan
# ─────────────────────────────────────────────────
@router.post("/analyze_message", response_model=MessageAnalysisResponse)
async def analyze_message(req: MessageAnalysisRequest):
    """Analyze an SMS/WhatsApp message for scam patterns."""
    result = await analyze_message_pipeline(
        message=req.message_text,
        sender=req.sender or "Unknown",
        links=req.links or [],
    )
    return MessageAnalysisResponse(**result)


# ─────────────────────────────────────────────────
#  Fraud Reporting
# ─────────────────────────────────────────────────
@router.post("/report_fraud", response_model=FraudReportResponse)
async def report_fraud(req: FraudReportRequest):
    """Report a fraud incident — triggers the Recovery Agent."""
    incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"

    recovery_result = await recovery_agent(
        incident_id=incident_id,
        transaction_id=req.transaction_id or "N/A",
        reported_by=req.reported_by_upi,
        amount_lost=req.amount_lost or 0,
        description=req.description,
        ai_analysis={},
    )

    # Persist incident — DB schema uses 'id', not 'incident_id'
    await save_fraud_incident({
        "id": incident_id,
        "transaction_id": req.transaction_id or "N/A",
        "reported_by": req.reported_by_upi,
        "description": req.description,
        "report": recovery_result["report"],
        "recovery_steps": str(recovery_result["recovery_steps"]),
        "status": "REPORTED",
    })

    await learning_agent("FRAUD_REPORTED", {
        "incident_id": incident_id,
        "amount_lost": req.amount_lost,
    })

    return FraudReportResponse(
        incident_id=incident_id,
        status="REPORTED",
        report_summary=recovery_result["report"],
        recovery_steps=recovery_result["recovery_steps"],
        bank_action=recovery_result["bank_action"].get("message", "Action initiated"),
        estimated_resolution="3-7 business days",
    )


# ─────────────────────────────────────────────────
#  Dashboard & Data endpoints
# ─────────────────────────────────────────────────
@router.get("/dashboard/stats")
async def dashboard_stats():
    return await get_dashboard_stats()


@router.get("/transactions")
async def list_transactions(limit: int = 20):
    return await get_all_transactions(limit=limit)


@router.get("/alerts")
async def list_alerts(limit: int = 10):
    return await get_all_alerts(limit=limit)


@router.get("/fraud-incidents")
async def list_fraud_incidents(limit: int = 10):
    return await get_fraud_incidents(limit=limit)


# ─────────────────────────────────────────────────
#  Demo Simulator
# ─────────────────────────────────────────────────
@router.get("/demo/{scenario_id}")
async def run_demo_scenario(scenario_id: int):
    """Run a pre-built demo scenario (1=normal, 2=fraud, 3=scam_message)."""
    scenario = get_scenario(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found. Use 1, 2, or 3.")

    if scenario["type"] == "transaction":
        result = await analyze_transaction_pipeline(scenario["data"])
        return {"scenario": scenario["name"], "type": "transaction", "result": result}

    elif scenario["type"] == "message":
        result = await analyze_message_pipeline(
            message=scenario["data"]["message"],
            sender=scenario["data"]["sender"],
            links=scenario["data"].get("links", []),
        )
        return {"scenario": scenario["name"], "type": "message", "result": result}

    raise HTTPException(status_code=400, detail="Unknown scenario type")
