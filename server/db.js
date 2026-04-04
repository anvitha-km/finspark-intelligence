import Database from 'better-sqlite3';

let db;

export function initDB() {
  db = new Database('./finspark.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id    TEXT UNIQUE,
      tenant_id   TEXT NOT NULL,
      feature_id  TEXT NOT NULL,
      channel     TEXT,
      user_id     TEXT,
      session_id  TEXT,
      journey_id  TEXT,
      outcome     TEXT DEFAULT 'invoked',
      timestamp   TEXT NOT NULL,
      meta        TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_tenant  ON events(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_feature ON events(feature_id);
    CREATE INDEX IF NOT EXISTS idx_ts      ON events(timestamp);

    CREATE TABLE IF NOT EXISTS consent_config (
      tenant_id          TEXT PRIMARY KEY,
      telemetry_enabled  INTEGER DEFAULT 1,
      sync_enabled       INTEGER DEFAULT 0,
      retention_days     INTEGER DEFAULT 90,
      updated_at         TEXT,
      updated_by         TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id  TEXT,
      action     TEXT,
      changed_by TEXT,
      before     TEXT,
      after      TEXT,
      timestamp  TEXT
    );

    CREATE TABLE IF NOT EXISTS feature_registry (
      feature_id   TEXT PRIMARY KEY,
      feature_name TEXT,
      module       TEXT,
      licensed_to  TEXT
    );
  `);

  const features = [
    ['loan-origination.start',           'Loan Application Start',   'Loan Origination', 'tenant_a,tenant_b,tenant_c'],
    ['loan-origination.kyc',             'KYC Verification',         'Loan Origination', 'tenant_a,tenant_b,tenant_c'],
    ['loan-origination.document-upload', 'Document Upload',          'Loan Origination', 'tenant_a,tenant_b,tenant_c'],
    ['loan-origination.credit-check',    'Credit Bureau Check',      'Loan Origination', 'tenant_a,tenant_b'],
    ['loan-origination.approval',        'Loan Approval Decision',   'Loan Origination', 'tenant_a,tenant_b,tenant_c'],
    ['account.profile-update',           'Profile Update',           'Account Mgmt',     'tenant_a,tenant_b,tenant_c'],
    ['account.limit-change',             'Credit Limit Change',      'Account Mgmt',     'tenant_a,tenant_c'],
    ['account.closure',                  'Account Closure',          'Account Mgmt',     'tenant_a,tenant_b,tenant_c'],
    ['report.generate',                  'Report Generator',         'Reporting',        'tenant_a,tenant_b'],
    ['report.export',                    'Report Export',            'Reporting',        'tenant_a'],
    ['report.schedule',                  'Scheduled Reports',        'Reporting',        'tenant_a,tenant_b'],
  ];

  const insert = db.prepare(`INSERT OR IGNORE INTO feature_registry VALUES (?,?,?,?)`);
  features.forEach(f => insert.run(...f));

  const consentInsert = db.prepare(
    `INSERT OR IGNORE INTO consent_config VALUES (?,1,0,90,datetime('now'),'system')`
  );
  ['tenant_a','tenant_b','tenant_c'].forEach(t => consentInsert.run(t));

  console.log('✅ DB initialized');
  return Promise.resolve(db);
}

export function getDB() { return db; }