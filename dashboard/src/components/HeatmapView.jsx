import React, { useEffect, useState } from 'react';

const TENANTS = ['tenant_a', 'tenant_b', 'tenant_c'];

function getColor(count) {
  if (count === 0) return '#1a1d2e';
  if (count < 20)  return '#2d3a6b';
  if (count < 50)  return '#3d52a0';
  if (count < 100) return '#5b72d4';
  return '#667eea';
}

export default function HeatmapView() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/analytics/heatmap')
      .then(r => r.json())
      .then(d => { setData(d.heatmap); setLoading(false); });
  }, []);

  // Build feature list and lookup map
  const features = [...new Set(data.map(d => d.feature_id))];
  const lookup = {};
  data.forEach(d => { lookup[d.feature_id + '|' + d.tenant_id] = d; });

  const getFeatureName = (fid) => {
    const row = data.find(d => d.feature_id === fid);
    return row ? row.feature_name : fid;
  };
  const getModule = (fid) => {
    const row = data.find(d => d.feature_id === fid);
    return row ? row.module : '';
  };

  if (loading) return <div style={{ color: '#718096', padding: 40, textAlign: 'center' }}>Loading heatmap...</div>;

  // Stats
  const totalEvents   = data.reduce((s, d) => s + d.count, 0);
  const unusedCount   = data.filter(d => d.count === 0).length;
  const activeFeatures = [...new Set(data.filter(d => d.count > 0).map(d => d.feature_id))].length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>Feature Adoption Heatmap</h2>
        <p style={{ color: '#718096', margin: 0, fontSize: 14 }}>Feature invocations across all tenants — last 30 days</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Events',      value: totalEvents.toLocaleString(), color: '#667eea' },
          { label: 'Active Features',   value: activeFeatures,               color: '#48bb78' },
          { label: 'Unused (licensed)', value: unusedCount,                  color: '#f56565' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#718096', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, padding: 24, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#718096', fontSize: 12, fontWeight: 500, padding: '8px 12px', borderBottom: '1px solid #2d3748' }}>Feature</th>
              <th style={{ textAlign: 'left', color: '#718096', fontSize: 12, fontWeight: 500, padding: '8px 12px', borderBottom: '1px solid #2d3748' }}>Module</th>
              {TENANTS.map(t => (
                <th key={t} style={{ textAlign: 'center', color: '#718096', fontSize: 12, fontWeight: 500, padding: '8px 16px', borderBottom: '1px solid #2d3748' }}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(fid => (
              <tr key={fid} style={{ borderBottom: '1px solid #2d3748' }}>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{getFeatureName(fid)}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#718096' }}>{getModule(fid)}</td>
                {TENANTS.map(t => {
                  const cell = lookup[fid + '|' + t];
                  const count = cell ? cell.count : 0;
                  return (
                    <td key={t} style={{ padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{
                        background: getColor(count),
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: count === 0 ? '#4a5568' : '#e2e8f0',
                        border: count === 0 ? '1px solid #2d3748' : 'none'
                      }}>
                        {count === 0 ? '—' : count}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <span style={{ fontSize: 12, color: '#718096' }}>Usage:</span>
          {[['#1a1d2e','0'],['#2d3a6b','1-19'],['#3d52a0','20-49'],['#5b72d4','50-99'],['#667eea','100+']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 14, height: 14, background: c, borderRadius: 3, border: '1px solid #2d3748' }}></div>
              <span style={{ fontSize: 11, color: '#718096' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}