// Login Page - AEVUM Enterprise ERP
// Authentication page with corporate design - Theme Support

import React, { useState, FormEvent } from 'react';
import { useAppStore } from '../../store';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';

const Login: React.FC = () => {
  const { login } = useAppStore();
  const { colors, mode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
      background: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: mode === 'light' 
          ? 'radial-gradient(ellipse at 20% 20%, rgba(30, 58, 138, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)'
          : 'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      
      {/* Animated grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: mode === 'light'
          ? `linear-gradient(rgba(30, 58, 138, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 58, 138, 0.03) 1px, transparent 1px)`
          : `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
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
            background: colors.sidebarGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
          }}>
            <span style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
            }}>T</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 4,
          }}>Tornadoes Job</h1>
          <p style={{
            fontSize: 12,
            color: colors.textMuted,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>Suite Entreprise · Connexion</p>
        </div>

        {/* Login Card */}
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: BorderRadius.xxl,
          padding: 32,
          boxShadow: mode === 'light' 
            ? '0 8px 32px rgba(0, 0, 0, 0.08)' 
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 24,
            textAlign: 'center',
          }}>Connexion à votre compte</h2>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Nom d'utilisateur</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: BorderRadius.lg,
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primaryMuted}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
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
                color: colors.textMuted,
                marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
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
                  background: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: BorderRadius.lg,
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primaryMuted}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '10px 12px',
                background: colors.dangerBg,
                border: `1px solid ${colors.dangerMuted}`,
                borderRadius: BorderRadius.md,
                marginBottom: 16,
                color: colors.danger,
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
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
                background: isLoading ? colors.primaryMuted : colors.primary,
                border: 'none',
                borderRadius: BorderRadius.lg,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: isLoading ? 'none' : '0 4px 16px rgba(30, 58, 138, 0.3)',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 58, 138, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 58, 138, 0.3)';
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
              color: colors.textMuted,
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = colors.primary}
            onMouseOut={(e) => e.currentTarget.style.color = colors.textMuted}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Quick Login Section */}
        <div style={{
          marginTop: 24,
          padding: 20,
          background: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${colors.border}`,
          borderRadius: BorderRadius.xxl,
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.textMuted,
            marginBottom: 12,
            fontFamily: "'DM Sans', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}>Accès rapide (Backend)</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => quickLogin('admin', 'Admin@123')}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: colors.primaryMuted,
                border: `1px solid ${colors.primaryMuted}`,
                borderRadius: BorderRadius.lg,
                color: colors.textSecondary,
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = colors.primaryMuted;
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = colors.primaryMuted;
                e.currentTarget.style.borderColor = colors.primaryMuted;
              }}
            >
              <span style={{ fontSize: 14 }}>👔</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Administrateur</span>
              <span style={{ color: colors.textMuted, fontSize: 10 }}>ADMIN</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 10,
          color: colors.textMuted,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          © 2025 Tornadoes Job · Architecture SOLID · JWT + RBAC
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

