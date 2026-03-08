// Settings Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import settingsService from '../../services/settingsService';

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

// Default values
const defaultCompanyInfo: CompanyInfo = {
  name: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  taxId: '',
};

const defaultNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  pushNotifications: true,
  weeklyReport: true,
  securityAlerts: true,
  attendanceAlerts: false,
  invoiceReminders: true,
};

const defaultSecuritySettings: SecuritySettings = {
  twoFactor: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  ipWhitelist: false,
  loginAlerts: true,
};

export const Settings: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'appearance' | 'integrations'>('general');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotificationSettings);
  const [security, setSecurity] = useState<SecuritySettings>(defaultSecuritySettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const [companyData, notificationData, securityData] = await Promise.all([
        settingsService.getCompanyInfo(),
        settingsService.getNotificationSettings(),
        settingsService.getSecuritySettings(),
      ]);

      if (companyData) {
        setCompanyInfo({
          name: companyData.name || '',
          address: companyData.address || '',
          phone: companyData.phone || '',
          email: companyData.email || '',
          website: companyData.website || '',
          taxId: companyData.taxId || '',
        });
      }

      if (notificationData) {
        setNotifications(notificationData);
      }

      if (securityData) {
        setSecurity({
          twoFactor: securityData.twoFactor,
          sessionTimeout: securityData.sessionTimeout,
          passwordExpiry: securityData.passwordExpiry,
          ipWhitelist: securityData.ipWhitelist,
          loginAlerts: securityData.loginAlerts,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'appearance', label: 'Apparence', icon: '🎨' },
    { id: 'integrations', label: 'Intégrations', icon: '🔗' },
  ];

  // Handle toggle
  const handleToggle = async (section: 'notifications' | 'security', key: string) => {
    let newValue: any;
    if (section === 'notifications') {
      newValue = { ...notifications, [key]: !notifications[key as keyof NotificationSettings] };
      setNotifications(newValue);
      await settingsService.updateNotificationSettings(newValue);
    } else {
      newValue = { ...security, [key]: !security[key as keyof SecuritySettings] };
      setSecurity(newValue);
      await settingsService.updateSecuritySettings(newValue);
    }
  };

  // Handle save company info
  const handleSaveCompanyInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      taxId: formData.get('taxId') as string,
    };
    
    const result = await settingsService.updateCompanyInfo(data);
    if (result) {
      setCompanyInfo(data);
      setIsModalOpen(false);
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
        {isLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>NOM</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.name || 'Non défini'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.email || 'Non défini'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TÉLÉPHONE</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.phone || 'Non défini'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>SITE WEB</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.website || 'Non défini'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ADRESSE</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.address || 'Non défini'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ID FISCAL</div>
              <div style={{ fontSize: 13, color: Colors.text, fontFamily: 'monospace' }}>{companyInfo.taxId || 'Non défini'}</div>
            </div>
          </div>
        )}
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
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
          Chargement des intégrations depuis le backend...
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

      {/* Modal for editing company info */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle} 
        size="md"
      >
        <form onSubmit={handleSaveCompanyInfo}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom de l'entreprise</label>
              <input name="name" defaultValue={companyInfo.name} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Email</label>
              <input name="email" type="email" defaultValue={companyInfo.email} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Téléphone</label>
              <input name="phone" defaultValue={companyInfo.phone} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Adresse</label>
              <input name="address" defaultValue={companyInfo.address} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Site web</label>
              <input name="website" defaultValue={companyInfo.website} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>ID Fiscal</label>
              <input name="taxId" defaultValue={companyInfo.taxId} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button variant="primary" type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;

