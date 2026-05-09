import React, { useState } from 'react';
import HeatmapView    from './components/HeatmapView';
import FunnelView     from './components/FunnelView';
import LicenseView    from './components/LicenseView';
import GovernanceView from './components/GovernanceView';
import InsightsView   from './components/InsightsView';
import ComparisonView from './components/ComparisonView';
import SystemStatusView from './components/SystemStatusView';
import LoginView      from './components/LoginView';

/**
 * Tab visibility by role:
 * - admin:  all tabs including Governance
 * - viewer: all tabs except Governance
 * - tenant: all tabs except Governance, data filtered to their tenant
 */
const ALL_TABS = ['Heatmap', 'Funnel', 'License Usage', 'Governance', 'Insights', 'Comparison', 'System Status'];

function getTabsForRole(role) {
  if (role === 'admin') return ALL_TABS;
  if (role === 'viewer') return ALL_TABS.filter(t => t !== 'Governance');
  // Strict tenant isolation: they cannot see Governance, Comparison, License Usage, or System Status
  return ['Heatmap', 'Funnel', 'Insights'];
}

export default function App() {
  const [user,      setUser]      = useState(null); // null = not logged in
  const [activeTab, setActiveTab] = useState('Heatmap');

  const handleLogin  = (u) => setUser(u);
  const handleLogout = ()  => { setUser(null); setActiveTab('Heatmap'); };

  // Not logged in → show login page
  if (!user) return <LoginView onLogin={handleLogin} />;

  const tabs = getTabsForRole(user.role);

  // Role badge color
  const roleBadge = {
    admin:  { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', label: 'Admin'          },
    viewer: { bg: 'rgba(6,182,212,0.15)',   color: '#06b6d4', label: 'Viewer'         },
    tenant: { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Tenant Manager' },
  }[user.role];

  return (
    <div className="app-container">

      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="app-logo">F</div>
        <div className="app-title-group">
          <div className="app-title">FinSpark Intelligence</div>
          <div className="app-subtitle">Enterprise Feature Analytics Platform</div>
        </div>

        {/* Role badge + user info + logout */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {user.tenant}
            </div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: roleBadge.bg, color: roleBadge.color
          }}>
            {roleBadge.label}
          </div>
          <button onClick={handleLogout} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--border-color)',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Sign out
          </button>
        </div>

        <div className="app-status" style={{ marginLeft: 16 }}>
          <div className="status-dot"></div>
          <span className="status-text">Live</span>
        </div>
      </header>

      {/* ─── Tab Bar ─── */}
      <nav className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
            {tab === 'Governance' && (
              <span style={{
                marginLeft: 6, fontSize: 9, padding: '1px 5px',
                borderRadius: 4, background: 'rgba(239,68,68,0.2)',
                color: 'var(--red)', fontWeight: 700
              }}>ADMIN</span>
            )}
          </button>
        ))}
      </nav>

      {/* ─── Viewer banner ─── */}
      {user.role === 'viewer' && (
        <div style={{
          background: 'rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.2)',
          padding: '8px 28px', fontSize: 12, color: '#06b6d4', flexShrink: 0
        }}>
          👁 Read-only access — contact an admin to modify governance settings
        </div>
      )}

      {/* ─── Tenant banner ─── */}
      {user.role === 'tenant' && (
        <div style={{
          background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.2)',
          padding: '8px 28px', fontSize: 12, color: '#10b981', flexShrink: 0
        }}>
          🏢 Viewing data for <strong>{user.tenant}</strong> only
        </div>
      )}

      {/* ─── Content ─── */}
      <main className="content-area">
        <div className="fade-in" key={activeTab}>
          {activeTab === 'Heatmap'       && <HeatmapView user={user} />}
          {activeTab === 'Funnel'        && <FunnelView user={user} />}
          {activeTab === 'License Usage' && <LicenseView />}
          {activeTab === 'Governance'    && <GovernanceView />}
          {activeTab === 'Insights'      && <InsightsView user={user} />}
          {activeTab === 'Comparison'    && <ComparisonView />}
          {activeTab === 'System Status' && <SystemStatusView />}
        </div>
      </main>

    </div>
  );
}
