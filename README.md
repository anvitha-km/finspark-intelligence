# FinSpark Intelligence
### Enterprise Feature Intelligence & Usage Analytics Framework

> **FinSpark Hackathon 2026 — Problem Statement 1**  
> *Theme: Turn Enterprise Product Usage into Strategic Intelligence*

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![JWT](https://img.shields.io/badge/Security-JWT_Auth-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

---

## 🚀 The Core Problem: The "Black Box" of Enterprise Telemetry

Enterprise lending platforms operate across highly complex environments involving multiple tenants, geographies, and strict deployment models (On-Premise vs. Cloud). Because of strict data privacy and isolation requirements, product leadership lacks structured, actionable insight into real feature usage. 

**FinSpark Intelligence** was built to answer the critical questions:
- Which features are licensed but never used?
- Where do specific user journeys experience drop-offs, and what is the exact **financial ROI/Revenue lost**?
- How does On-Premise usage differ from Cloud deployments?

## 💡 Our Solution: A 4-Layer Deployment-Aware Architecture

We did not just build a dashboard; we built an end-to-end, enterprise-grade telemetry pipeline explicitly designed to respect strict deployment boundaries while delivering predictive intelligence.

### 1. Telemetry Instrumentation Layer (Omnichannel)
- **Cross-Channel Tracking**: Included `mock-sdks` (Python API Interceptor & iOS Swift Tracker) demonstrate our ability to ingest events from Web, Mobile, API, and Batch channels.
- **Zero-Impact Interceptor Design**: Lightweight trackers tag events with standardized taxonomy (`tenant_id`, `feature_id`, `journey_id`) without slowing down core lending applications.

### 2. Deployment-Aware Aggregation Model
- **Cloud Tenants**: Stream real-time, native telemetry directly to the central analytics engine.
- **On-Premise Tenants (Federated Analytics)**: PII and raw data **never** leave the customer's firewall. We built a local `onprem-aggregator.js` script that mathematically summarizes local data and securely syncs only anonymized aggregates to the central platform daily. 
- *Check the "System Status" tab to see this live sync visualization.*

### 3. Enterprise Dashboard Layer (Strategic Intelligence)
- **Feature Adoption Heatmaps**: Instantly spot dead features across multiple tenants.
- **Journey Funnel Analytics**: Visually track drop-offs in critical flows like Loan Origination.
- **Concrete ROI Measurement**: Our Insights Engine translates abstract session drop-offs into **hard dollar amounts** (e.g., "$120,000 lost revenue per cycle") based on standard loan values and approval rates.
- **Predictive Intelligence**: We utilize a **Least Squares Linear Regression algorithm** to mathematically forecast future adoption trends and flag churn risks before renewals.

### 4. Governance & Compliance Controls
- **Strict Tenant Isolation (RBAC)**: Enforced via `JWT Auth Middleware`. When a Tenant Manager logs in, the backend alters SQL queries to mathematically guarantee they can never view another tenant's data.
- **PII Masking**: Deterministic hashing strips user identities at the source.
- **Configurable Consent & Audit Logs**: Tenants can toggle telemetry on/off, generating an immutable JSON audit log of every configuration change.

---

## 🏗️ Enterprise Scalability Path (Production Architecture)

While this hackathon MVP utilizes lightweight SQLite and bypasses strict JWT for a seamless "one-click" local demo, the architecture is fundamentally designed to scale to billions of events across thousands of tenants.

When deploying to a true production environment, the ingestion and storage layers are swapped:
- **Event Bus (Kafka)**: The Express `POST /api/events` route pushes directly to a Kafka topic, handling massive throughput spikes.
- **OLAP Database (ClickHouse)**: SQLite is replaced with ClickHouse or Apache Pinot, enabling sub-second analytical queries over billions of rows.
- **Containerization**: The backend is fully Dockerized (see `Dockerfile`) and secured via `JWT Auth`, ready to be orchestrated via Kubernetes.

---

## 🏆 Hackathon Evaluation Matrix Fulfillment

| Criterion (100 Points) | How We Delivered |
|------------------------|------------------|
| **Enterprise Realism (20%)** | Omnichannel architecture (`mock-sdks`), structured event schema, Docker containerization. |
| **Deployment Awareness (15%)** | Built a distinct Federated Aggregation sync model specifically for On-Premise firewalls. |
| **Security & Compliance (15%)** | JWT Middleware, SQL-level Multi-Tenant data isolation, PII Masking, Immutable Audit Logs. |
| **Scalability Readiness (15%)** | Documented Kafka + ClickHouse upgrade path; SQLite already heavily indexed for millions of rows. |
| **Business Impact Clarity (15%)** | Replaced abstract "drop offs" with exact **Lost Revenue ROI ($)** calculations in the Predictive Insights tab. |
| **Innovation & Practicality (10%)** | Least Squares Linear regression applied directly to SQLite data for predictive trend forecasting. |
| **Ease of Deployability (10%)** | Zero complex dependencies. Deploys via `npm start` or Vercel natively. |

---

## 💻 Live Demo & Quick Start

### Live Links
- **Frontend Dashboard:** [https://finspark-dash.vercel.app](https://finspark-dash.vercel.app)
- **Backend API:** Hosted on Railway (Zero-config connection)

### Run Locally (Under 2 Minutes)

**Prerequisites:** Node.js v18+

1. **Clone & Start Backend:**
```bash
git clone https://github.com/anvitha-km/finspark-intelligence.git
cd finspark-intelligence/server
npm install
npm start
# Server starts at http://localhost:4000
```

2. **Start Dashboard:**
```bash
# In a new terminal
cd ../dashboard
npm install
npm start
# Dashboard opens at http://localhost:3000
```

3. **Simulate On-Premise Federated Sync (Optional):**
```bash
# Run this inside the /server folder to simulate the secure On-Prem aggregator syncing data to the Cloud
node onprem-aggregator.js
```

---

## 📄 License
MIT — see [LICENSE](LICENSE) for details.

*Built for FinSpark Hackathon 2026*
