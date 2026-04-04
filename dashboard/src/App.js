import React, { useState } from 'react';
import HeatmapView    from './components/HeatmapView';
import FunnelView     from './components/FunnelView';
import LicenseView    from './components/LicenseView';
import GovernanceView from './components/GovernanceView';
import InsightsView   from './components/InsightsView';

const tabs = ['Heatmap', 'Funnel', 'License Usage', 'Governance', 'Insights'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Heatmap');

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#1a1d2e', borderBottom: '1px solid #2d3748', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff' }}>F</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>FinSpark Intelligence</div>
          <div style={{ fontSize: 12, color: '#718096' }}>Enterprise Feature Analytics Platform</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#48bb78' }}></div>
          <span style={{ fontSize: 12, color: '#48bb78' }}>Live</span>
        </div>
      </div>

      <div style={{ background: '#1a1d2e', borderBottom: '1px solid #2d3748', padding: '0 32px', display: 'flex', gap: 4 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            background: 'transparent',
            color: activeTab === tab ? '#667eea' : '#718096',
            borderBottom: activeTab === tab ? '2px solid #667eea' : '2px solid transparent',
            transition: 'all 0.2s'
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '32px' }}>
        {activeTab === 'Heatmap'       && <HeatmapView />}
        {activeTab === 'Funnel'        && <FunnelView />}
        {activeTab === 'License Usage' && <LicenseView />}
        {activeTab === 'Governance'    && <GovernanceView />}
        {activeTab === 'Insights'      && <InsightsView />}
      </div>
    </div>
  );
}