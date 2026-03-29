from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─────────────────────────────────────────────
#  Request models
# ─────────────────────────────────────────────
class TransactionRequest(BaseModel):
    sender_upi: str = Field(..., example="rahul@upi")
    receiver_upi: str = Field(..., example="merchant@paytm")
    receiver_name: str = Field(..., example="Raj Stores")
    amount: float = Field(..., gt=0, example=1500.0)
    device_id: Optional[str] = Field(default="device_001")
    location: Optional[str] = Field(default="Mumbai, MH")
    timestamp: Optional[str] = Field(default=None)
    note: Optional[str] = Field(default="")


class MessageAnalysisRequest(BaseModel):
    message_text: str = Field(..., example="Your KYC is expiring! Click here now...")
    sender: Optional[str] = Field(default="Unknown")
    message_type: Optional[str] = Field(default="SMS")  # SMS | WhatsApp | Email
    links: Optional[List[str]] = Field(default=[])


class FraudReportRequest(BaseModel):
    transaction_id: Optional[str] = Field(default=None)
    reported_by_upi: str = Field(..., example="rahul@upi")
    description: str = Field(..., example="I was tricked into sending money")
    amount_lost: Optional[float] = Field(default=0)


# ─────────────────────────────────────────────
#  Response models
# ─────────────────────────────────────────────
class RiskFactor(BaseModel):
    factor: str
    severity: str  # LOW | MEDIUM | HIGH
    detail: str


class AnalysisResponse(BaseModel):
    transaction_id: str
    risk_score: float                  # 0–100
    decision: str                      # ALLOW | WARN | BLOCK
    decision_color: str                # green | amber | red
    explanation: str
    risk_factors: List[RiskFactor]
    scam_patterns: Optional[List[str]] = []
    recommended_action: str
    processing_time_ms: float
    agent_trace: Optional[List[dict]] = []


class MessageAnalysisResponse(BaseModel):
    is_scam: bool
    scam_probability: float            # 0–100
    scam_type: Optional[str]
    detected_patterns: List[str]
    explanation: str
    recommended_action: str
    flagged_links: Optional[List[str]] = []


class FraudReportResponse(BaseModel):
    incident_id: str
    status: str
    report_summary: str
    recovery_steps: List[str]
    bank_action: str
    estimated_resolution: str
