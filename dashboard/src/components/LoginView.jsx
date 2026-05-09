import React, { useState } from 'react';

/**
 * LoginView — simple hardcoded credential login for hackathon demo.
 *
 * In production this would be JWT + OAuth. For the demo:
 * - Admin:  admin@finspark.io / admin123
 * - Viewer: viewer@finspark.io / viewer123
 *
 * Role difference:
 * - Admin:  all tabs + can see Governance + tenant management actions
 * - Viewer: Heatmap, Funnel, License Usage, Insights, Comparison only
 *           Governance tab hidden (sensitive config)
 */

const USERS = [
  {
    email:    'admin@finspark.io',
    password: 'admin123',
    role:     'admin',
    name:     'Admin User',
    tenant:   'All Tenants'
  },
  {
    email:    'viewer@finspark.io',
    password: 'viewer123',
    role:     'viewer',
    name:     'Viewer User',
    tenant:   'Read Only'
  },
  {
    email:    'tenant_a@finspark.io',
    password: 'tenanta123',
    role:     'tenant',
    name:     'Tenant A Manager',
    tenant:   'tenant_a'
  },
  {
    email:    'tenant_b@finspark.io',
    password: 'tenantb123',
    role:     'tenant',
    name:     'Tenant B Manager',
    tenant:   'tenant_b'
  },
  {
    email:    'tenant_c@finspark.io',
    password: 'tenantc123',
    role:     'tenant',
    name:     'Tenant C Manager',
    tenant:   'tenant_c'
  },
  {
    email:    'tenant_d@finspark.io',
    password: 'tenantd123',
    role:     'tenant',
    name:     'Tenant D Manager',
    tenant:   'tenant_d'
  },
  {
    email:    'tenant_e@finspark.io',
    password: 'tenante123',
    role:     'tenant',
    name:     'Tenant E Manager',
    tenant:   'tenant_e'
  },
];

export default function LoginView({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay for realism
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 600);
  };

  const fillDemo = (type) => {
    if (type === 'admin')  { setEmail('admin@finspark.io');    setPassword('admin123');    }
    if (type === 'viewer') { setEmail('viewer@finspark.io');   setPassword('viewer123');   }
    if (type === 'tenant_a') { setEmail('tenant_a@finspark.io'); setPassword('tenanta123');  }
    if (type === 'tenant_b') { setEmail('tenant_b@finspark.io'); setPassword('tenantb123');  }
    if (type === 'tenant_c') { setEmail('tenant_c@finspark.io'); setPassword('tenantc123');  }
    if (type === 'tenant_d') { setEmail('tenant_d@finspark.io'); setPassword('tenantd123');  }
    if (type === 'tenant_e') { setEmail('tenant_e@finspark.io'); setPassword('tenante123');  }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 0',
      boxSizing: 'border-box',
      overflowY: 'auto',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', margin: 'auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(99,102,241,0.4)'
          }}>F</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            FinSpark Intelligence
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Enterprise Feature Analytics Platform
          </div>
        </div>

        {/* Login card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16, padding: 32,
          boxShadow: '0 4px 32px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
            Sign in to your account
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@finspark.io" required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'var(--red-bg)', border: '1px solid var(--red-border)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13,
                color: 'var(--red)', marginBottom: 16
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: 8,
                background: loading ? 'var(--border-color)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: 12, padding: 20, marginTop: 16
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>
            DEMO CREDENTIALS — click to fill
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { type: 'admin',    label: 'Admin',           desc: 'All tabs + Governance',      color: '#6366f1' },
              { type: 'viewer',   label: 'Viewer',          desc: 'Read-only, no Governance',   color: '#06b6d4' },
              { type: 'tenant_a', label: 'Tenant A Manager',desc: 'Filtered to tenant_a only',  color: '#10b981' },
              { type: 'tenant_b', label: 'Tenant B Manager',desc: 'Filtered to tenant_b only',  color: '#f59e0b' },
              { type: 'tenant_c', label: 'Tenant C Manager',desc: 'Filtered to tenant_c only',  color: '#ef4444' },
              { type: 'tenant_d', label: 'Tenant D Manager',desc: 'Filtered to tenant_d only',  color: '#8b5cf6' },
              { type: 'tenant_e', label: 'Tenant E Manager',desc: 'Filtered to tenant_e only',  color: '#ec4899' },
            ].map(u => (
              <button key={u.type} onClick={() => fillDemo(u.type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                  background: 'var(--bg-secondary)', border: `1px solid ${u.color}22`,
                  textAlign: 'left', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: u.color, flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {u.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
