import React, { useEffect, useState } from 'react';

export default function LicenseView() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/analytics/license-usage')
      .then(r => r.json())
      .then(d => { setFeatures(d.features); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#718096', padding: 40, textAlign: 'center' }}>Loading...</div>;

  const atRisk = features.filter(f => f.adoptionRate < 50);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>License vs Usage</h2>
        <p style={{ color: '#718096', margin: 0, fontSize: 14 }}>Which licensed features are actually being used?</p>
      </div>

      {/* Risk alert */}
      {atRisk.length > 0 && (
        <div style={{ background: '#2d1515', border: '1px solid #f56565', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ color: '#f56565', fontWeight: 600, fontSize: 14 }}>{atRisk.length} features have under 50% adoption</div>
            <div style={{ color: '#718096', fontSize: 12, marginTop: 2 }}>Renewal risk — {atRisk.map(f => f.featureName).join(', ')}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f1117' }}>
              {['Feature', 'Module', 'Licensed', 'Active', 'Adoption', 'Invocations', 'Unused Tenants'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#718096', fontSize: 12, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} style={{ borderTop: '1px solid #2d3748' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{f.featureName}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#718096' }}>{f.module}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#e2e8f0', textAlign: 'center' }}>{f.licensedCount}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#48bb78', textAlign: 'center', fontWeight: 600 }}>{f.activeCount}</td>
                <td style={{ padding: '12px 16px', minWidth: 140 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#2d3748', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${f.adoptionRate}%`, background: f.adoptionRate >= 75 ? '#48bb78' : f.adoptionRate >= 50 ? '#ecc94b' : '#f56565', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: f.adoptionRate >= 75 ? '#48bb78' : f.adoptionRate >= 50 ? '#ecc94b' : '#f56565', fontWeight: 600, minWidth: 36 }}>{f.adoptionRate}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#667eea', textAlign: 'center', fontWeight: 600 }}>{f.totalInvocations}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#f56565' }}>{f.unusedTenants.join(', ') || <span style={{ color: '#48bb78' }}>All active</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}