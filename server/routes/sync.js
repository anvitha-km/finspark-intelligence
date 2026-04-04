// routes/sync.js
// Receives anonymized aggregate payloads from on-prem aggregators
import { Router } from 'express';
import { getDB } from '../db.js';

const router = Router();

// In-memory store for received aggregates (use Redis/DB in production)
const receivedAggregates = [];

router.post('/aggregate', (req, res) => {
  const payload = req.body;
  payload.receivedAt = new Date().toISOString();
  receivedAggregates.push(payload);

  console.log(`📥 Received on-prem aggregate from tenant hash: ${payload.tenantHash}`);
  console.log(`   Features: ${payload.featureSummary?.length}, Events: ${payload.featureSummary?.reduce((s,f) => s + f.totalInvocations, 0)}`);

  res.json({ success: true, message: 'Aggregate received and stored' });
});

router.get('/aggregates', (req, res) => {
  res.json({ aggregates: receivedAggregates });
});

export default router;