import React, { useEffect, useState } from 'react';

export default function GovernanceView() {
  const [tenants, setTenants] = useState([]);
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);

  const load = () => {
    Promise.all([
      fetch('http://localhost:4000/api/governance/consent').then(r => r.json()),
      fetch('http://localhost:4000/api/governance/audit-log').then(r => r.json())
    ]).then(([c, a]) => { setTenants(c.tenants); setLogs(a.logs); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (tenantId, field, value) => {
    setSaving(tenantId);
    await fetch(`http://localhost:4000/api/governance/consent/${tenantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value ? 1 : 0, changedBy: 'admin' })
    });
    setSaving(null);
    load();
  };

  if (loading) return <div style={{ color: '#718096', padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>Governance & Compliance</h2>
        <p style={{ color: '#718096', margin: 0, fontSize: 14 }}>Manage telemetry consent and view audit trail per tenant</p>
      </div>

      {/* Consent controls */}
      <div style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 16px', fontSize: 16 }}>Tenant Consent Settings</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Tenant', 'Telemetry Enabled', 'Anon Sync', 'Retention (days)', 'Last Updated By', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 16px', textAlign: 'left', color: '#718096', fontSize: 12, borderBottom: '1px solid #2d3748' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.tenant_id} style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{t.tenant_id}</td>
                <td style={{ padding: '14px 16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!t.telemetry_enabled} onChange={e => toggle(t.tenant_id, 'telemetryEnabled', e.target.checked)} disabled={saving === t.tenant_id} />
                    <span style={{ fontSize: 13, color: t.telemetry_enabled ? '#48bb78' : '#f56565' }}>{t.telemetry_enabled ? 'On' : 'Off'}</span>
                  </label>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!t.sync_enabled} onChange={e => toggle(t.tenant_id, 'syncEnabled', e.target.checked)} disabled={saving === t.tenant_id} />
                    <span style={{ fontSize: 13, color: t.sync_enabled ? '#48bb78' : '#718096' }}>{t.sync_enabled ? 'On' : 'Off'}</span>
                  </label>
                </td>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: 13 }}>{t.retention_days} days</td>
                <td style={{ padding: '14px 16px', color: '#718096', fontSize: 12 }}>{t.updated_by}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: saving === t.tenant_id ? '#2d3748' : t.telemetry_enabled ? '#1a3a2a' : '#2d1515', color: saving === t.tenant_id ? '#718096' : t.telemetry_enabled ? '#48bb78' : '#f56565', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {saving === t.tenant_id ? 'Saving...' : t.telemetry_enabled ? 'Active' : 'Paused'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit log */}
      <div style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 16px', fontSize: 16 }}>Audit Log</h3>
        {logs.length === 0
          ? <div style={{ color: '#718096', fontSize: 13 }}>No changes recorded yet. Toggle a consent setting above to generate an entry.</div>
          : logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #2d3748', alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#667eea', marginTop: 5, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0' }}>
                  <span style={{ color: '#667eea', fontWeight: 600 }}>{log.changed_by}</span> updated <span style={{ color: '#ecc94b' }}>{log.tenant_id}</span> — {log.action}
                </div>
                <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{new Date(log.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}