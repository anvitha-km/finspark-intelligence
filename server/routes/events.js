import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db.js';

const router = Router();

router.post('/batch', (req, res) => {
  const { events } = req.body;
  if (!Array.isArray(events) || events.length === 0)
    return res.status(400).json({ error: 'No events provided' });

  const db = getDB();
  const consentCheck = db.prepare(
    'SELECT telemetry_enabled FROM consent_config WHERE tenant_id = ?'
  );
  const insert = db.prepare(`
    INSERT OR IGNORE INTO events
      (event_id, tenant_id, feature_id, channel, user_id,
       session_id, journey_id, outcome, timestamp, meta)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);

  const insertMany = db.transaction((evts) => {
    let accepted = 0, rejected = 0;
    for (const e of evts) {
      const consent = consentCheck.get(e.tenantId);
      if (!consent || !consent.telemetry_enabled) { rejected++; continue; }
      insert.run(
        e.eventId, e.tenantId, e.featureId, e.channel,
        e.userId, e.sessionId, e.journeyId, e.outcome,
        e.timestamp, JSON.stringify(e.meta || {})
      );
      accepted++;
    }
    return { accepted, rejected };
  });

  const result = insertMany(events);
  res.json({ success: true, ...result });
});

router.get('/consent/:tenantId', (req, res) => {
  const db = getDB();
  const row = db.prepare(
    'SELECT telemetry_enabled FROM consent_config WHERE tenant_id = ?'
  ).get(req.params.tenantId);
  res.json({ telemetryEnabled: row ? row.telemetry_enabled === 1 : false });
});

export default router;