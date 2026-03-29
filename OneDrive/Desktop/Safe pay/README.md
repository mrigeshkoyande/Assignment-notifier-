# 🛡️ Safe-Pay AI — Fraud Prevention Copilot

> **Multi-agent GenAI system** for real-time UPI / digital payment fraud detection, powered by **Google Gemini** and an **event-driven agent pipeline**.

---

## 🚀 Quick Start

```batch
# Windows — just double-click:
start.bat
```

Or manually:

```bash
# Terminal 1 — Backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🏗️ Architecture

```
Detect → Reason → Explain → Prevent → Recover
```

| Agent | Role |
|-------|------|
| 🔵 Transaction Risk Agent | Analyzes amount, history, device, location |
| 🟡 Scam Intelligence Agent | Detects phishing, social engineering, URLs |
| 🔴 Decision Agent | Makes final ALLOW / WARN / BLOCK call |
| 💬 Explanation Agent | Generates user-friendly AI explanation |
| 🔧 Recovery Agent | Files report, triggers bank action |
| 📚 Learning Agent | Stores incidents for continuous improvement |

---

## 🔧 Configuration

Copy `.env.example` to `.env` and add your key:

```env
GOOGLE_API_KEY=your_google_ai_studio_api_key_here
```

Get a free key at: https://aistudio.google.com/apikey

> **Note:** The system works fully without a key using deterministic rule-based fallback. Gemini enriches explanations and adds deeper analysis when a key is provided.

---

## 🎮 Demo Scenarios

| # | Scenario | Expected Decision |
|---|----------|------------------|
| 1 | ₹500 to known contact | ✅ ALLOW |
| 2 | ₹49,999 to flagged UPI at 2 AM | 🚫 BLOCK |
| 3 | KYC phishing SMS from "SBI" | ⚠️ WARN / BLOCK |

Run them from the Dashboard → **Live Demo Scenarios** section, or via API:

```bash
GET http://localhost:8000/api/demo/1
GET http://localhost:8000/api/demo/2
GET http://localhost:8000/api/demo/3
```

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/analyze_transaction` | Full transaction risk analysis |
| POST | `/api/analyze_message` | SMS/message scam detection |
| POST | `/api/report_fraud` | File fraud report + Recovery Agent |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/transactions` | Transaction history |
| GET | `/api/alerts` | High-risk alerts |
| GET | `/api/demo/{1\|2\|3}` | Run demo scenarios |

Interactive docs: **http://localhost:8000/docs**

---

## 📁 Project Structure

```
safe-pay-ai/
├── backend/
│   ├── main.py                   # FastAPI entry
│   ├── api/ routes.py + models.py
│   ├── agents/ orchestrator.py   # All 6 agents
│   ├── tools/                    # 5 MCP tools
│   ├── database/ db.py           # SQLite + seeding
│   └── simulator/ scenarios.py   # Demo data
├── frontend/
│   └── src/
│       ├── pages/               # Dashboard, SendMoney, Scanner, History, Report
│       └── components/          # RiskGauge, DecisionBadge, ExplanationCard, etc.
├── requirements.txt
├── start.bat
└── README.md
```

---

## 🛠️ Tech Stack

- **Backend:** Python · FastAPI · aiosqlite · google-genai
- **AI:** Google Gemini 2.0 Flash (via google-genai SDK)
- **Frontend:** React 18 · Vite · React Router 6
- **Database:** SQLite (local, zero config)

---

*Built for hackathon demonstration. Architecture is production-ready and cloud-deployable.*
