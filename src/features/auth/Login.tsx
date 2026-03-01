// Login Page - AEVUM Enterprise ERP
// Authentication page with corporate design

import React, { useState, FormEvent } from 'react';
import { useAppStore } from '../../store';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../constants/theme';

const Login: React.FC = () => {
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Email ou mot de passe incorrect');
    }
    setIsLoading(false);
  };

  // Quick login buttons for demo
  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    setIsLoading(true);
    await login(userEmail, userPassword);
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: Colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(100,140,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(167,139,250,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      
      {/* Animated grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(100,140,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,140,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg,#6490ff,#3b5bdb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(100,140,255,0.4)',
          }}>
            <span style={{
              fontFamily: "'DM Serif Display',Georgia,serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
            }}>N</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display',Georgia,serif",
            fontSize: 28,
            fontWeight: 700,
            color: Colors.text,
            marginBottom: 4,
          }}>Nexus ERP</h1>
          <p style={{
            fontSize: 12,
            color: Colors.textMuted,
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>Suite Entreprise · Connexion</p>
        </div>

        {/* Login Card */}
        <div style={{
          background: Colors.card,
          border: `1px solid ${Colors.border}`,
          borderRadius: BorderRadius.xxl,
          padding: 32,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: Colors.text,
            marginBottom: 24,
            textAlign: 'center',
          }}>Connexion à votre compte</h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 6,
                fontFamily: "'DM Sans',sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@entreprise.sn"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: Colors.input,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: BorderRadius.lg,
                  color: Colors.text,
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = Colors.accent;
                  e.target.style.boxShadow = `0 0 0 3px ${Colors.accent}22`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = Colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 6,
                fontFamily: "'DM Sans',sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: Colors.input,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: BorderRadius.lg,
                  color: Colors.text,
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = Colors.accent;
                  e.target.style.boxShadow = `0 0 0 3px ${Colors.accent}22`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = Colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(224,80,80,0.1)',
                border: '1px solid rgba(224,80,80,0.2)',
                borderRadius: BorderRadius.md,
                marginBottom: 16,
                color: Colors.red,
                fontSize: 12,
                fontFamily: "'DM Sans',sans-serif",
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? 'rgba(100,140,255,0.5)' : 'linear-gradient(135deg,#6490ff,#3b5bdb)',
                border: 'none',
                borderRadius: BorderRadius.lg,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: isLoading ? 'none' : '0 4px 16px rgba(100,140,255,0.3)',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(100,140,255,0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(100,140,255,0.3)';
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Forgot password */}
          <div style={{
            textAlign: 'center',
            marginTop: 16,
          }}>
            <a href="#" style={{
              fontSize: 12,
              color: Colors.textMuted,
              fontFamily: "'DM Sans',sans-serif",
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = Colors.accent}
            onMouseOut={(e) => e.currentTarget.style.color = Colors.textMuted}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Quick Login Section */}
        <div style={{
          marginTop: 24,
          padding: 20,
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${Colors.border}`,
          borderRadius: BorderRadius.xxl,
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            color: Colors.textMuted,
            marginBottom: 12,
            fontFamily: "'DM Sans',sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}>Accès rapide (Demo)</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => quickLogin('dg@nexus-erp.sn', 'admin123')}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'rgba(100,140,255,0.08)',
                border: '1px solid rgba(100,140,255,0.15)',
                borderRadius: BorderRadius.lg,
                color: Colors.textLight,
                fontSize: 12,
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(100,140,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(100,140,255,0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(100,140,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(100,140,255,0.15)';
              }}
            >
              <span style={{ fontSize: 14 }}>👔</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Directeur Général</span>
              <span style={{ color: Colors.textMuted, fontSize: 10 }}>DG</span>
            </button>

            <button
              onClick={() => quickLogin('rh@nexus-erp.sn', 'rh123')}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'rgba(62,207,142,0.08)',
                border: '1px solid rgba(62,207,142,0.15)',
                borderRadius: BorderRadius.lg,
                color: Colors.textLight,
                fontSize: 12,
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(62,207,142,0.15)';
                e.currentTarget.style.borderColor = 'rgba(62,207,142,0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(62,207,142,0.08)';
                e.currentTarget.style.borderColor = 'rgba(62,207,142,0.15)';
              }}
            >
              <span style={{ fontSize: 14 }}>👥</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Responsable RH</span>
              <span style={{ color: Colors.textMuted, fontSize: 10 }}>RH</span>
            </button>

            <button
              onClick={() => quickLogin('finance@nexus-erp.sn', 'finance123')}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'rgba(251,146,60,0.08)',
                border: '1px solid rgba(251,146,60,0.15)',
                borderRadius: BorderRadius.lg,
                color: Colors.textLight,
                fontSize: 12,
                fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(251,146,60,0.15)';
                e.currentTarget.style.borderColor = 'rgba(251,146,60,0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(251,146,60,0.08)';
                e.currentTarget.style.borderColor = 'rgba(251,146,60,0.15)';
              }}
            >
              <span style={{ fontSize: 14 }}>💰</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Directeur Financier</span>
              <span style={{ color: Colors.textMuted, fontSize: 10 }}>Finance</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 10,
          color: Colors.textDim,
          fontFamily: "'DM Sans',sans-serif",
        }}>
          © 2025 Nexus ERP · Architecture SOLID · JWT + RBAC
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;

