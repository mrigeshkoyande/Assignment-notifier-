import aiosqlite
import json
import os
from datetime import datetime, timedelta
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "safepay.db")

# ─────────────────────────────────────────────
#  Schema
# ─────────────────────────────────────────────
SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    upi_id TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    risk_profile TEXT DEFAULT 'LOW'
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    sender_upi TEXT NOT NULL,
    receiver_upi TEXT NOT NULL,
    receiver_name TEXT,
    amount REAL NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    device_id TEXT,
    location TEXT,
    risk_score REAL DEFAULT 0,
    decision TEXT DEFAULT 'ALLOW',
    explanation TEXT,
    status TEXT DEFAULT 'COMPLETED',
    is_fraud INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fraud_incidents (
    id TEXT PRIMARY KEY,
    transaction_id TEXT,
    reported_by TEXT,
    description TEXT,
    report TEXT,
    recovery_steps TEXT,
    status TEXT DEFAULT 'REPORTED',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE IF NOT EXISTS threat_intelligence (
    id TEXT PRIMARY KEY,
    indicator TEXT NOT NULL,
    indicator_type TEXT NOT NULL,
    threat_level TEXT NOT NULL,
    scam_type TEXT,
    description TEXT,
    report_count INTEGER DEFAULT 1,
    first_seen TEXT DEFAULT CURRENT_TIMESTAMP,
    last_seen TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_memory (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    data TEXT NOT NULL,
    feedback TEXT,
    processed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
"""

# ─────────────────────────────────────────────
#  Seed data
# ─────────────────────────────────────────────
SEED_USERS = [
    ("user_001", "Rahul Sharma",     "rahul@upi",    "9876543210"),
    ("user_002", "Priya Patel",      "priya@upi",    "9123456789"),
    ("user_003", "Amit Kumar",       "amit@upi",     "9988776655"),
    ("user_004", "Sunita Devi",      "sunita@ybl",   "9001234567"),
    ("user_005", "Vikram Singh",     "vikram@okaxis", "9876012345"),
]

SEED_TRANSACTIONS = []
base_time = datetime.utcnow()
for i in range(20):
    ts = base_time - timedelta(hours=random.randint(1, 720))
    SEED_TRANSACTIONS.append((
        f"txn_{i:04d}",
        "rahul@upi",
        random.choice(["priya@upi", "amit@upi", "sunita@ybl", "vikram@okaxis"]),
        random.choice(["Priya Patel", "Amit Kumar", "Sunita Devi", "Vikram Singh"]),
        round(random.uniform(50, 5000), 2),
        ts.isoformat(),
        "device_rahul_001",
        "Mumbai, MH",
        round(random.uniform(5, 35), 1),
        "ALLOW",
        "Normal transaction within expected patterns.",
        "COMPLETED",
        0,
    ))

SEED_THREATS = [
    ("thr_001", "9999999999@paytm",  "UPI_ID",  "HIGH",   "IMPERSONATION",  "Reports of bank officer impersonation", 47),
    ("thr_002", "prize@fakebank",    "UPI_ID",  "CRITICAL","LOTTERY_SCAM",   "Lottery prize scam account",            132),
    ("thr_003", "http://kyc-upd8.xyz","URL",    "HIGH",   "PHISHING",       "Fake KYC update phishing site",         89),
    ("thr_004", "8888877777@ybl",    "UPI_ID",  "HIGH",   "REFUND_SCAM",    "Fake refund request scam",              23),
    ("thr_005", "help-sbi@fakemail", "EMAIL",   "CRITICAL","PHISHING",       "SBI impersonation phishing email",     201),
    ("thr_006", "http://bit.ly/upihlp","URL",   "MEDIUM", "REDIRECT",       "Shortened URL redirecting to scam",     15),
    ("thr_007", "customer.care.hdfc@gmail.com","EMAIL","HIGH","IMPERSONATION","HDFC bank fake helpline",            58),
    ("thr_008", "newacct_win@upi",   "UPI_ID",  "CRITICAL","ACCOUNT_TAKEOVER","Account takeover pattern detected",   77),
]


async def init_db():
    """Create tables and seed if empty."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript(SCHEMA)
        await db.commit()

        row = await (await db.execute("SELECT COUNT(*) FROM users")).fetchone()
        if row[0] == 0:
            await db.executemany(
                "INSERT OR IGNORE INTO users (id, name, upi_id, phone) VALUES (?,?,?,?)",
                SEED_USERS,
            )
            await db.executemany(
                """INSERT OR IGNORE INTO transactions
                   (id,sender_upi,receiver_upi,receiver_name,amount,timestamp,
                    device_id,location,risk_score,decision,explanation,status,is_fraud)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                SEED_TRANSACTIONS,
            )
            await db.executemany(
                """INSERT OR IGNORE INTO threat_intelligence
                   (id,indicator,indicator_type,threat_level,scam_type,description,report_count)
                   VALUES (?,?,?,?,?,?,?)""",
                SEED_THREATS,
            )
            await db.commit()


# ─────────────────────────────────────────────
#  CRUD helpers
# ─────────────────────────────────────────────
async def get_user_transactions(upi_id: str, limit: int = 30):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            """SELECT * FROM transactions WHERE sender_upi=?
               ORDER BY timestamp DESC LIMIT ?""",
            (upi_id, limit),
        ) as cur:
            return [dict(r) for r in await cur.fetchall()]


async def save_transaction(txn: dict):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT OR REPLACE INTO transactions
               (id,sender_upi,receiver_upi,receiver_name,amount,timestamp,
                device_id,location,risk_score,decision,explanation,status,is_fraud)
               VALUES (:id,:sender_upi,:receiver_upi,:receiver_name,:amount,:timestamp,
                       :device_id,:location,:risk_score,:decision,:explanation,:status,:is_fraud)""",
            txn,
        )
        await db.commit()


async def check_threat(indicator: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM threat_intelligence WHERE indicator=?", (indicator,)
        ) as cur:
            row = await cur.fetchone()
            return dict(row) if row else None


async def save_fraud_incident(incident: dict):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT OR REPLACE INTO fraud_incidents
               (id,transaction_id,reported_by,description,report,recovery_steps,status)
               VALUES (:id,:transaction_id,:reported_by,:description,:report,:recovery_steps,:status)""",
            incident,
        )
        await db.commit()


async def get_all_transactions(limit: int = 50):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?", (limit,)
        ) as cur:
            return [dict(r) for r in await cur.fetchall()]


async def get_all_alerts(limit: int = 20):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            """SELECT * FROM transactions WHERE decision IN ('WARN','BLOCK')
               ORDER BY timestamp DESC LIMIT ?""",
            (limit,),
        ) as cur:
            return [dict(r) for r in await cur.fetchall()]


async def get_dashboard_stats():
    async with aiosqlite.connect(DB_PATH) as db:
        total     = (await (await db.execute("SELECT COUNT(*) FROM transactions")).fetchone())[0]
        blocked   = (await (await db.execute("SELECT COUNT(*) FROM transactions WHERE decision='BLOCK'")).fetchone())[0]
        warned    = (await (await db.execute("SELECT COUNT(*) FROM transactions WHERE decision='WARN'")).fetchone())[0]
        incidents = (await (await db.execute("SELECT COUNT(*) FROM fraud_incidents")).fetchone())[0]
        avg_risk  = (await (await db.execute("SELECT AVG(risk_score) FROM transactions")).fetchone())[0] or 0
        return {
            "total_transactions": total,
            "blocked_transactions": blocked,
            "warned_transactions": warned,
            "fraud_incidents": incidents,
            "avg_risk_score": round(avg_risk, 1),
            "safe_transactions": total - blocked - warned,
        }


async def save_learning_event(event_type: str, data: dict):
    async with aiosqlite.connect(DB_PATH) as db:
        import uuid
        await db.execute(
            "INSERT INTO learning_memory (id,event_type,data) VALUES (?,?,?)",
            (str(uuid.uuid4()), event_type, json.dumps(data)),
        )
        await db.commit()


async def get_fraud_incidents(limit: int = 20):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM fraud_incidents ORDER BY created_at DESC LIMIT ?", (limit,)
        ) as cur:
            return [dict(r) for r in await cur.fetchall()]
