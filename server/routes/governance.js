import { Router } from 'express';
import { getDB } from '../db.js';

const router = Router();

router.get('/consent', (req, res) => {
  const db = getDB();
  res.json({ tenants: db.prepare('SELECT * FROM consent_config').all() });
});

router.patch('/consent/:tenantId', (req, res) => {
  const db = getDB();
  const { tenantId } = req.params;
  const { telemetryEnabled, syncEnabled, retentionDays, changedBy } = req.body;

  const current = db.prepare(
    'SELECT * FROM consent_config WHERE tenant_id = ?'
  ).get(tenantId);
  if (!current) return res.status(404).json({ error: 'Tenant not found' });

  db.prepare(`
    UPDATE consent_config SET
      telemetry_enabled = ?, sync_enabled = ?,
      retention_days = ?, updated_at = datetime('now'), updated_by = ?
    WHERE tenant_id = ?
  `).run(
    telemetryEnabled ?? current.telemetry_enabled,
    syncEnabled      ?? current.sync_enabled,
    retentionDays    ?? current.retention_days,
    changedBy || 'admin', tenantId
  );

  db.prepare(`
    INSERT INTO audit_log (tenant_id, action, changed_by, before, after, timestamp)
    VALUES (?, 'consent_update', ?, ?, ?, datetime('now'))
  `).run(tenantId, changedBy || 'admin',
    JSON.stringify(current),
    JSON.stringify({ telemetryEnabled, syncEnabled, retentionDays })
  );

  res.json({ success: true });
});

router.get('/audit-log', (req, res) => {
  const db = getDB();
  res.json({ logs: db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100').all() });
});

export default router;