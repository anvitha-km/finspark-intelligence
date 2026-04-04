import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db.js';

const router = Router();

router.get('/heatmap', (req, res) => {
  const db = getDB();
  const { days = 30 } = req.query;

  const rows = db.prepare(`
    SELECT e.feature_id, e.tenant_id, COUNT(*) as count,
           MAX(e.timestamp) as last_used,
           fr.feature_name, fr.module, fr.licensed_to
    FROM events e
    JOIN feature_registry fr ON fr.feature_id = e.feature_id
    WHERE e.timestamp >= datetime('now', '-' || ? || ' days')
    GROUP BY e.feature_id, e.tenant_id
    ORDER BY e.feature_id, e.tenant_id
  `).all(days);

  const allFeatures = db.prepare('SELECT * FROM feature_registry').all();
  const usedSet = new Set(rows.map(r => r.feature_id + '|' + r.tenant_id));

  const unused = [];
  for (const f of allFeatures) {
    for (const t of f.licensed_to.split(',')) {
      if (!usedSet.has(f.feature_id + '|' + t)) {
        unused.push({
          feature_id: f.feature_id, tenant_id: t, count: 0,
          last_used: null, feature_name: f.feature_name,
          module: f.module, licensed_to: f.licensed_to
        });
      }
    }
  }

  res.json({ heatmap: [...rows, ...unused] });
});

router.get('/funnel/:journeyName', (req, res) => {
  const db = getDB();
  const journeySteps = {
    'loan-origination': [
      'loan-origination.start', 'loan-origination.kyc',
      'loan-origination.document-upload',
      'loan-origination.credit-check', 'loan-origination.approval'
    ]
  };

  const steps = journeySteps[req.params.journeyName];
  if (!steps) return res.status(404).json({ error: 'Journey not found' });

  const { tenantId } = req.query;
  const funnel = steps.map((stepId, i) => {
    const row = tenantId
      ? db.prepare(`SELECT COUNT(DISTINCT session_id) as sessions FROM events WHERE feature_id = ? AND tenant_id = ?`).get(stepId, tenantId)
      : db.prepare(`SELECT COUNT(DISTINCT session_id) as sessions FROM events WHERE feature_id = ?`).get(stepId);
    return { step: i + 1, featureId: stepId, label: stepId.split('.')[1].replace(/-/g,' '), sessions: row.sessions };
  });

  res.json({ journey: req.params.journeyName, funnel });
});

router.get('/license-usage', (req, res) => {
  const db = getDB();
  const { days = 30 } = req.query;
  const features = db.prepare('SELECT * FROM feature_registry').all();

  const result = features.map(f => {
    const licensedTenants = f.licensed_to.split(',').filter(Boolean);
    const usageCounts = db.prepare(`
      SELECT tenant_id, COUNT(*) as cnt FROM events
      WHERE feature_id = ? AND timestamp >= datetime('now', '-' || ? || ' days')
      GROUP BY tenant_id
    `).all(f.feature_id, days);

    const usedBy = new Set(usageCounts.map(u => u.tenant_id));
    const totalInvocations = usageCounts.reduce((s, u) => s + u.cnt, 0);

    return {
      featureId: f.feature_id,
      featureName: f.feature_name,
      module: f.module,
      licensedCount: licensedTenants.length,
      activeCount: usedBy.size,
      adoptionRate: licensedTenants.length > 0
        ? Math.round((usedBy.size / licensedTenants.length) * 100) : 0,
      totalInvocations,
      unusedTenants: licensedTenants.filter(t => !usedBy.has(t))
    };
  });

  res.json({ features: result });
});

router.post('/seed-demo', (req, res) => {
  const db = getDB();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO events
      (event_id, tenant_id, feature_id, channel, user_id,
       session_id, journey_id, outcome, timestamp, meta)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);

  const tenants = ['tenant_a','tenant_b','tenant_c'];
  const features = [
    ['loan-origination.start',           100],
    ['loan-origination.kyc',              85],
    ['loan-origination.document-upload',  62],
    ['loan-origination.credit-check',     44],
    ['loan-origination.approval',         31],
    ['account.profile-update',            55],
    ['account.limit-change',              12],
    ['account.closure',                    8],
    ['report.generate',                   28],
    ['report.export',                      5],
    ['report.schedule',                   18],
  ];

  const seedMany = db.transaction(() => {
    let count = 0;
    for (const tenant of tenants) {
      for (const [featureId, baseCount] of features) {
        const n = Math.floor(baseCount * (0.4 + Math.random() * 0.6));
        for (let i = 0; i < n; i++) {
          const daysAgo = Math.floor(Math.random() * 30);
          const ts = new Date(Date.now() - daysAgo * 86400000).toISOString();
          insert.run(
            uuidv4(), tenant, featureId, 'web',
            'u_' + Math.random().toString(36).slice(2),
            'sess_' + Math.random().toString(36).slice(2),
            featureId.split('.')[0],
            'invoked', ts, '{}'
          );
          count++;
        }
      }
    }
    return count;
  });

  res.json({ seeded: seedMany() });
});

export default router;