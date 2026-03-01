// Settings Feature - AEVUM Enterprise ERP
// Complete system settings and configuration module

import React, { useState } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';

// Types
interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  attendanceAlerts: boolean;
  invoiceReminders: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: boolean;
  loginAlerts: boolean;
}

// Mock company info
const mockCompanyInfo: CompanyInfo = {
  name: 'AEVUM Senegal',
  address: 'Point E, Rue 10, BP 12345, Dakar, Senegal',
  phone: '+221 33 123 45 67',
  email: 'contact@aevum.sn',
  website: 'www.aevum.sn',
  taxId: 'SN-2024-001234',
};

// Mock notification settings
const mockNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  pushNotifications: true,
  weeklyReport: true,
  securityAlerts: true,
  attendanceAlerts: false,
  invoiceReminders: true,
};

// Mock security settings
const mockSecuritySettings: SecuritySettings = {
  twoFactor: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  ipWhitelist: false,
  loginAlerts: true,
};

export const Settings: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'appearance' | 'integrations'>('general');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(mockCompanyInfo);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationSettings);
  const [security, setSecurity] = useState<SecuritySettings>(mockSecuritySettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'appearance', label: 'Apparence', icon: '🎨' },
    { id: 'integrations', label: 'Intégrations', icon: '🔗' },
  ];

  // Handle toggle
  const handleToggle = (section: 'notifications' | 'security', key: string) => {
    if (section === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof NotificationSettings] }));
    } else {
      setSecurity(prev => ({ ...prev, [key]: !prev[key as keyof NotificationSettings] }));
    }
  };

  // Render general settings
  const renderGeneralSettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Company Information */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Informations de l'entreprise</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Informations générales de l'organisation</p>
          </div>
          <Button variant="secondary" onClick={() => { setModalTitle('Modifier les informations'); setIsModalOpen(true); }}>
            ✏️ Modifier
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>NOM</div>
            <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div>
            <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.email}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TÉLÉPHONE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.phone}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>SITE WEB</div>
            <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.website}</div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ADRESSE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.address}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ID FISCAL</div>
            <div style={{ fontSize: 13, color: Colors.text, fontFamily: 'monospace' }}>{companyInfo.taxId}</div>
          </div>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Paramètres régionaux</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Langue, fuseau horaire, devises</p>
          </div>
          <Button variant="secondary" onClick={() => { setModalTitle('Modifier la région'); setIsModalOpen(true); }}>
            ✏️ Modifier
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>LANGUE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>Français (France)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>FUSEAU HORAIRE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>GMT+0 (Dakar)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DEVISE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>XOF (FCFA)</div>
          </div>
        </div>
      </Card>

      {/* Date & Time Format */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Format 日期和时间</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Formats de date et d'heure</p>
          </div>
          <Button variant="secondary" onClick={() => { setModalTitle('Modifier les formats'); setIsModalOpen(true); }}>
            ✏️ Modifier
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>FORMAT DATE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>DD/MM/YYYY</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>FORMAT HEURE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>24 heures (14:30)</div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render notification settings
  const renderNotificationSettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Notifications par email</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Gérez les notifications envoyées par email</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { key: 'emailAlerts', label: 'Alertes système', desc: 'Recevoir les alertes importantes du système' },
            { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé hebdomadaire de l\'activité' },
            { key: 'securityAlerts', label: 'Alertes de sécurité', desc: 'Notifications sur les événements de sécurité' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>{item.desc}</div>
              </div>
              <button 
                onClick={() => handleToggle('notifications', item.key)}
                style={{ 
                  width: 48, 
                  height: 26, 
                  borderRadius: 13, 
                  border: 'none', 
                  background: notifications[item.key as keyof NotificationSettings] ? Colors.accent : Colors.textDim,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: notifications[item.key as keyof NotificationSettings] ? 25 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Autres notifications</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Autres types de notifications</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { key: 'pushNotifications', label: 'Notifications push', desc: 'Recevoir des notifications dans le navigateur' },
            { key: 'attendanceAlerts', label: 'Alertes présence', desc: 'Notifications sur les présences et absences' },
            { key: 'invoiceReminders', label: 'Rappels factures', desc: 'Rappels pour les factures en attente' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>{item.desc}</div>
              </div>
              <button 
                onClick={() => handleToggle('notifications', item.key)}
                style={{ 
                  width: 48, 
                  height: 26, 
                  borderRadius: 13, 
                  border: 'none', 
                  background: notifications[item.key as keyof NotificationSettings] ? Colors.accent : Colors.textDim,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: notifications[item.key as keyof NotificationSettings] ? 25 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Render security settings
  const renderSecuritySettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Authentification</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Paramètres de sécurité pour la connexion</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { key: 'twoFactor', label: 'Authentification à deux facteurs', desc: 'Exiger un code supplémentaire à chaque connexion' },
            { key: 'loginAlerts', label: 'Alertes de connexion', desc: 'Notifier lors de nouvelles connexions suspectes' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>{item.desc}</div>
              </div>
              <button 
                onClick={() => handleToggle('security', item.key)}
                style={{ 
                  width: 48, 
                  height: 26, 
                  borderRadius: 13, 
                  border: 'none', 
                  background: security[item.key as keyof SecuritySettings] ? Colors.accent : Colors.textDim,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: security[item.key as keyof SecuritySettings] ? 25 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Sessions & Accès</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Gestion des sessions et accès</p>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>Délai d'inactivité</div>
              <div style={{ fontSize: 11, color: Colors.textMuted }}>Fermer la session après {security.sessionTimeout} min d'inactivité</div>
            </div>
            <select 
              defaultValue={security.sessionTimeout}
              style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>Expiration du mot de passe</div>
              <div style={{ fontSize: 11, color: Colors.textMuted }}>Exiger un nouveau mot de passe tous les {security.passwordExpiry} jours</div>
            </div>
            <select 
              defaultValue={security.passwordExpiry}
              style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
            >
              <option value={30}>30 jours</option>
              <option value={60}>60 jours</option>
              <option value={90}>90 jours</option>
              <option value={180}>6 mois</option>
            </select>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Liste IP autorisée</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Restreindre l'accès à certaines adresses IP</p>
          </div>
          <button 
            onClick={() => handleToggle('security', 'ipWhitelist')}
            style={{ 
              width: 48, 
              height: 26, 
              borderRadius: 13, 
              border: 'none', 
              background: security.ipWhitelist ? Colors.accent : Colors.textDim,
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              background: '#fff',
              position: 'absolute',
              top: 3,
              left: security.ipWhitelist ? 25 : 3,
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
        <div style={{ padding: 12, background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8, fontSize: 12, color: Colors.textMuted }}>
          {security.ipWhitelist ? (
            <div>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Adresses IP autorisées:</div>
              <div style={{ fontFamily: 'monospace' }}>192.168.1.0/24</div>
              <div style={{ fontFamily: 'monospace' }}>10.0.0.0/8</div>
            </div>
          ) : (
            <div>Aucune restriction d'IP - Accès depuis n'importe où</div>
          )}
        </div>
      </Card>
    </div>
  );

  // Render appearance settings
  const renderAppearanceSettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Thème</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Choisissez votre thème d'interface</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { id: 'dark', label: 'Sombre', active: true, colors: ['#07080f', '#0c0d17', '#6490ff'] },
            { id: 'light', label: 'Clair', active: false, colors: ['#ffffff', '#f1f5f9', '#3b82f6'] },
            { id: 'system', label: 'Système', active: false, colors: ['#07080f', '#ffffff', '#6490ff'] },
          ].map(theme => (
            <div 
              key={theme.id}
              style={{ 
                padding: 16, 
                borderRadius: 12, 
                border: theme.active ? `2px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                cursor: 'pointer',
                background: theme.id === 'dark' ? Colors.card : '#fff',
              }}
            >
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {theme.colors.map((color, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 6, background: color }} />
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text, textAlign: 'center' }}>{theme.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Accent</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Couleur d'accentuation de l'interface</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {['#6490ff', '#3ecf8e', '#a78bfa', '#fb923c', '#e05050', '#c9a84c'].map(color => (
            <div 
              key={color}
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: color,
                cursor: 'pointer',
                border: color === '#6490ff' ? `3px solid ${Colors.text}` : 'none',
              }}
            />
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Sidebar</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Configuration de la barre latérale</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: Colors.text }}>Réduire automatiquement</div>
          <button style={{ width: 48, height: 26, borderRadius: 13, border: 'none', background: Colors.accent, cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: 25, transition: 'left 0.2s' }} />
          </button>
        </div>
      </Card>
    </div>
  );

  // Render integrations settings
  const renderIntegrationsSettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>API & Intégrations</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Gérez les connexions aux services externes</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { name: 'Google Workspace', status: 'connected', icon: '📧' },
            { name: 'Microsoft 365', status: 'disconnected', icon: '📅' },
            { name: 'Slack', status: 'disconnected', icon: '💬' },
            { name: 'Stripe', status: 'connected', icon: '💳' },
            { name: 'Dropbox', status: 'disconnected', icon: '📁' },
          ].map(item => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: item.status === 'connected' ? '#3ecf8e' : Colors.textMuted }}>
                    {item.status === 'connected' ? 'Connecté' : 'Non connecté'}
                  </div>
                </div>
              </div>
              <Button variant={item.status === 'connected' ? 'secondary' : 'primary'} onClick={() => alert(`${item.name} - Fonctionnalité bientôt disponible`)}>
                {item.status === 'connected' ? 'Déconnecter' : 'Connecter'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Clés API</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Gestion des clés API pour les développeurs</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>Clé API Production</div>
            <div style={{ fontSize: 12, color: Colors.textMuted, fontFamily: 'monospace' }}>sk_live_••••••••••••••••</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => alert('Copié!')}>📋 Copier</Button>
            <Button variant="secondary" onClick={() => alert('Régénérer - Bientôt disponible')}>🔄 Régénérer</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Paramètres
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Configuration du système · Préférences · Sécurité
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div>
          <Card style={{ padding: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: 8,
                  background: activeTab === tab.id ? 'rgba(100, 140, 255, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? Colors.accent : Colors.textMuted,
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'integrations' && renderIntegrationsSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

