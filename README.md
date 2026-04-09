# FinSpark Intelligence
### Enterprise Feature Intelligence & Usage Analytics Framework

> **FinSpark Hackathon 2026 — Problem Statement 1**  
> *Turn Enterprise Product Usage into Strategic Intelligence*

[![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

---

## What Is This?

Enterprise lending platforms operate across multiple tenants, geographies, and deployment models — but most have **zero visibility** into how their features are actually used. Product managers make roadmap decisions based on guesswork. Sales teams don't know which customers are at churn risk. Nobody knows which licensed features are sitting completely unused.

**FinSpark Intelligence** solves this. It's a full-stack analytics platform that:

- Captures every feature invocation across Web, Mobile, API, and Batch channels
- Works on **both On-Premise and Cloud deployments** — with different architectures for each
- Maintains strict **tenant isolation** so no customer ever sees another's data
- Enforces **PII masking at the point of capture** — user IDs are hashed before they ever touch the network
- Delivers a **5-tab real-time dashboard** with adoption heatmaps, journey funnels, license vs usage analytics, governance controls, and predictive insights

---

## Live Demo

```
Dashboard:  http://localhost:3000
Backend:    http://localhost:4000
Health:     http://localhost:4000/health
```

**5 working dashboard tabs:**

| Tab | What It Shows |
|-----|---------------|
| **Heatmap** | Feature invocation counts across all tenants — dead features instantly visible |
| **Funnel** | Journey drop-off rates — exactly where users abandon the loan application |
| **License vs Usage** | Which licensed features have < 50% adoption — renewal risk detection |
| **Governance** | Per-tenant consent toggles with live audit log |
| **Insights** | Churn risk signals, conversion rates, session trend vs predicted |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CHANNEL LAYER                           │
│         Web SDK · Mobile SDK · API Interceptor · Batch      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│               TELEMETRY INSTRUMENTATION                      │
│    Event Capture · PII Masking · Consent Gate · Journey      │
│                     Correlation                              │
└──────────┬────────────────────────────────┬─────────────────┘
           │                                │
┌──────────▼──────────┐          ┌──────────▼──────────────┐
│  ON-PREM FEDERATED  │          │  CLOUD CENTRALIZED       │
│  Local aggregation  │          │  Multi-tenant isolation  │
│  Anon sync (opt-in) │          │  Stream processing       │
└──────────┬──────────┘          └──────────┬───────────────┘
           │                                │
┌──────────▼────────────────────────────────▼───────────────┐
│                  ENTERPRISE DASHBOARD                       │
│   Heatmap · Funnel · License · Governance · Insights        │
└─────────────────────────────────────────────────────────────┘
```

### The Key Architectural Differentiator

Most analytics platforms only work in the cloud. Enterprise lending platforms are often deployed **on customer infrastructure** — meaning raw telemetry can never leave their network.

Our solution uses a **Federated Aggregation Model**:

- **On-Prem path:** A lightweight Docker-compatible agent runs *inside* the customer's infrastructure. It computes all statistics locally, strips every raw identifier, and optionally syncs only anonymized aggregate numbers to the central platform. Raw events never leave the customer's network.
- **Cloud path:** Events flow to a centralized Express server with per-tenant isolation enforced at the database query level.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Recharts | Fast to build, excellent chart ecosystem |
| Backend | Node.js + Express | Same language as SDK, easy deployment |
| Database | SQLite (better-sqlite3) | Zero setup, production path is ClickHouse |
| SDK | Vanilla JavaScript | Zero dependencies, works anywhere |
| On-Prem Agent | Node.js script | Deployable as Docker container |

**Production upgrade path:**
- SQLite → ClickHouse (identical SQL, 100x faster OLAP)
- Express → Kafka ingestion pipeline
- SQLite indexes → already O(log n) at millions of rows

---

## Project Structure

```
finspark-intelligence/
├── sdk/
│   ├── featureSdk.js          # Core tracker — batches & flushes events
│   ├── piiMasker.js           # One-way hash on userId at capture time
│   ├── consentGate.js         # Per-tenant telemetry on/off switch
│   └── journeyTracker.js      # Stitches multi-step flows by journeyId
│
├── server/
│   ├── index.js               # Express entry point
│   ├── db.js                  # SQLite init, schema, seed data
│   ├── onprem-aggregator.js   # Federated on-prem agent
│   └── routes/
│       ├── events.js          # POST /batch, GET /consent/:tenantId
│       ├── analytics.js       # Heatmap, funnel, license-usage, seed
│       ├── governance.js      # Consent config, audit log
│       └── sync.js            # Receives on-prem aggregate payloads
│
└── dashboard/
    └── src/
        └── components/
            ├── HeatmapView.jsx      # Feature adoption grid
            ├── FunnelView.jsx       # Journey drop-off chart
            ├── LicenseView.jsx      # License vs usage table
            ├── GovernanceView.jsx   # Consent toggles + audit log
            └── InsightsView.jsx     # Predictive signals + trend chart
```

---

## API Reference

### Events — `/api/events`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/batch` | Ingest event batch from SDK. Consent checked per tenant before every insert. Returns `{ accepted, rejected }` |
| `GET` | `/consent/:tenantId` | Returns `{ telemetryEnabled: bool }`. Called by SDK on init. |

### Analytics — `/api/analytics`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/heatmap` | JOINs events + feature_registry. Returns used rows (with counts) **and** unused rows (count: 0) for unlicensed-but-unused detection |
| `GET` | `/funnel/:journeyName` | Per step: `COUNT(DISTINCT session_id)`. Returns drop-off chain across the journey |
| `GET` | `/license-usage` | Computes `adoptionRate %` and `unusedTenants[]` per feature |
| `POST` | `/seed-demo` | Seeds 941 synthetic events across 3 tenants × 11 features × 30 days |

### Governance — `/api/governance`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/consent` | All tenant consent configurations |
| `PATCH` | `/consent/:tenantId` | Update consent settings. Writes immutable audit log entry with before/after JSON |
| `GET` | `/audit-log` | Last 100 configuration change entries |

### Sync — `/api/sync`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/aggregate` | Receives anonymized aggregate payload from on-prem agent |
| `GET` | `/aggregates` | All received on-prem aggregate payloads |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | `{ status: "ok", time: ISO8601 }` |

---

## Database Schema

```sql
-- Core telemetry store
CREATE TABLE events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id    TEXT UNIQUE,           -- deduplication key
  tenant_id   TEXT NOT NULL,         -- isolation boundary
  feature_id  TEXT NOT NULL,         -- e.g. "loan-origination.kyc"
  channel     TEXT,                  -- web | mobile | api | batch
  user_id     TEXT,                  -- one-way hashed, never raw
  session_id  TEXT,
  journey_id  TEXT,                  -- stitches multi-step flows
  outcome     TEXT DEFAULT 'invoked',
  timestamp   TEXT NOT NULL,
  meta        TEXT                   -- JSON for extensibility
);

-- Indexes for sub-100ms queries even at scale
CREATE INDEX idx_tenant  ON events(tenant_id);
CREATE INDEX idx_feature ON events(feature_id);
CREATE INDEX idx_ts      ON events(timestamp);

-- Licensed feature catalog
CREATE TABLE feature_registry (
  feature_id   TEXT PRIMARY KEY,
  feature_name TEXT,
  module       TEXT,
  licensed_to  TEXT    -- comma-separated tenant IDs
);

-- Per-tenant consent settings
CREATE TABLE consent_config (
  tenant_id          TEXT PRIMARY KEY,
  telemetry_enabled  INTEGER DEFAULT 1,
  sync_enabled       INTEGER DEFAULT 0,
  retention_days     INTEGER DEFAULT 90,
  updated_at         TEXT,
  updated_by         TEXT
);

-- Immutable audit trail
CREATE TABLE audit_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id  TEXT,
  action     TEXT,
  changed_by TEXT,
  before     TEXT,   -- JSON snapshot of previous state
  after      TEXT,   -- JSON snapshot of new state
  timestamp  TEXT
);
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repository

```bash
git clone https://github.com/anvitha-km/finspark-intelligence.git
cd finspark-intelligence
```

### 2. Start the backend server

```bash
cd server
npm install
node index.js
```

Server starts at `http://localhost:4000`

### 3. Seed demo data

```bash
# In a new terminal
curl -X POST http://localhost:4000/api/analytics/seed-demo
# → { "seeded": 941 }
```

### 4. Start the dashboard

```bash
cd dashboard
npm install
npm start
```

Dashboard opens at `http://localhost:3000`

### 5. Run the on-prem aggregator (optional)

```bash
cd server
node onprem-aggregator.js tenant_a
node onprem-aggregator.js tenant_b
node onprem-aggregator.js tenant_c
```

This simulates the federated on-prem agent. Watch it compute local stats, strip all identifying data, and sync only anonymized aggregates to the server.

---

## Privacy & Compliance Design

### PII Masking

User identifiers are hashed using a deterministic rolling hash **before the event object is even created in memory**. The raw userId never touches the queue, the network, or the database.

```
Raw userId: "user@company.com"
          ↓ piiMasker.js (djb2 hash)
Stored:   "u_3f7a2b"
```

Same user always maps to the same hash — analytics remain consistent without storing any identifiable data.

### Double Consent Enforcement

Consent is checked at **two independent layers**:

1. **SDK layer (client-side):** `consentGate.js` checks cached consent status. If `telemetryEnabled = false`, `track()` returns immediately. No event is created.
2. **Server layer:** `POST /api/events/batch` checks `consent_config` for each tenant in the database *before every insert*. Even if the SDK is bypassed, the server drops events for opted-out tenants.

### Audit Trail

Every consent configuration change writes an immutable entry to `audit_log` with:
- Who made the change (`changed_by`)
- Exact timestamp
- Full JSON snapshot of the state before and after the change

### On-Prem Data Guarantee

When running the federated aggregator, the following **never leaves customer infrastructure**:
- Raw event records
- User IDs (even hashed)
- Session identifiers
- Raw feature sequences

Only statistical aggregates (counts, rates) are transmitted — and only if the tenant has explicitly enabled `sync_enabled`.

---

## Scoring Matrix (PS1 Evaluation Criteria)

| Criterion | Weight | Our Implementation |
|-----------|--------|--------------------|
| Enterprise Realism & Architectural Soundness | 20% | Dual-path architecture, standardized event schema, interceptor-based SDK, SQLite with production upgrade path |
| Deployment Awareness (On-Prem + Cloud) | 15% | Federated aggregator runs inside customer infra; cloud path has centralized Express server with tenant isolation |
| Security & Compliance Design | 15% | PII masking at source, double consent enforcement, immutable audit log, RBAC design |
| Scalability & Multi-Tenant Readiness | 15% | tenant_id on every query, indexed DB, isolated consent config, per-tenant dashboard filtering |
| Business Impact Clarity | 15% | Churn risk detection, funnel drop-off recovery, license waste identification, upsell signals |
| Innovation & Practicality | 10% | Predictive insights tab, anonymized federated sync bridge, privacy-proof on-prem agent |
| Ease of Deployability | 10% | `npm install && node index.js` — runs in under 2 minutes on any machine |

---

## Business Impact

**Before FinSpark Intelligence:**
- Product roadmap decisions take 3 analyst weeks
- Renewal conversations happen without data
- Nobody knows 40% of licensed features are unused

**After FinSpark Intelligence:**
- Identify unused licensed features in 10 seconds
- See exactly where loan applications drop off in the funnel
- Get churn risk alerts before the renewal conversation
- Benchmark on-prem vs cloud adoption automatically

---

## Future Roadmap

### Phase 1 — Production Hardening
- Replace SQLite with ClickHouse for OLAP-scale analytics
- Replace batch HTTP with Apache Kafka for event ingestion
- JWT + Open Policy Agent for production RBAC
- Kubernetes deployment manifests

### Phase 2 — AI-Powered Intelligence
- LLM-powered anomaly detection on usage trends
- Predictive churn scoring per tenant per feature
- Natural language query interface ("Why did KYC drop last week?")
- Auto-generated roadmap priority recommendations

### Phase 3 — Enterprise Expansion
- Multi-geography data residency compliance
- Native iOS and Android SDK
- Bi-directional sync for cross-tenant benchmarking
- White-labelled tenant-facing adoption portals

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built for FinSpark Hackathon 2026 · Problem Statement 1*
