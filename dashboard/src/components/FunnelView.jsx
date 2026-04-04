import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STEP_LABELS = {
  'start': 'App Start', 'kyc': 'KYC Check',
  'document-upload': 'Doc Upload', 'credit-check': 'Credit Check', 'approval': 'Approval'
};

export default function FunnelView() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/analytics/funnel/loan-origination')
      .then(r => r.json())
      .then(d => { setData(d.funnel); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#718096', padding: 40, textAlign: 'center' }}>Loading funnel...</div>;

  const top = data[0]?.sessions || 1;
  const chartData = data.map(d => ({
    ...d,
    label: STEP_LABELS[d.label] || d.label,
    dropOff: d.step > 1 ? Math.round((1 - d.sessions / (data[d.step - 2]?.sessions || 1)) * 100) : 0
  }));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>Journey Funnel — Loan Origination</h2>
        <p style={{ color: '#718096', margin: 0, fontSize: 14 }}>Session drop-off at each step across all tenants</p>
      </div>

      {/* Funnel bars */}
      <div style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 12, padding: 32, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="label" tick={{ fill: '#718096', fontSize: 12 }} />
            <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#667eea' }}
            />
            <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={`hsl(${240 + i * 15}, 70%, ${65 - i * 8}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Step cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {chartData.map((step, i) => (
          <div key={i} style={{ background: '#1a1d2e', border: '1px solid #2d3748', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, color: '#718096', marginBottom: 6 }}>Step {step.step}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 }}>{step.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#667eea' }}>{step.sessions}</div>
            <div style={{ fontSize: 11, color: '#718096' }}>sessions</div>
            {step.dropOff > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#f56565', fontWeight: 600 }}>↓ {step.dropOff}% drop</div>
            )}
            <div style={{ marginTop: 8, height: 4, background: '#2d3748', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${(step.sessions / top) * 100}%`, background: '#667eea', borderRadius: 2 }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}