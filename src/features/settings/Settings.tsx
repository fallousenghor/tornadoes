// Settings Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Toggle } from '../../components/common';
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

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  lastSync?: string;
  config?: Record<string, string>;
  category: 'database' | 'email' | 'storage' | 'api' | 'auth';
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  active: boolean;
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

const defaultIntegrations: Integration[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    description: 'Primary database connection for application data',
    icon: '🗄️',
    connected: true,
    status: 'connected',
    lastSync: 'Il y a 2 min',
    category: 'database',
  },
  {
    id: 'email-smtp',
    name: 'Email Service (SMTP)',
    description: 'SMTP server for sending transactional and notification emails',
    icon: '📧',
    connected: true,
    status: 'connected',
    lastSync: 'Il y a 5 min',
    category: 'email',
  },
  {
    id: 'storage-s3',
    name: 'Stockage Cloud (S3)',
    description: 'Object storage for documents, images, and file uploads',
    icon: '📦',
    connected: false,
    status: 'disconnected',
    category: 'storage',
  },
  {
    id: 'api-keys',
    name: 'Clés API',
    description: 'Manage API keys for external service authentication',
    icon: '🔑',
    connected: true,
    status: 'connected',
    category: 'api',
  },
  {
    id: 'oauth',
    name: 'OAuth / SSO',
    description: 'Single sign-on via external identity providers',
    icon: '🔐',
    connected: false,
    status: 'disconnected',
    category: 'auth',
  },
];

const defaultApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'sk-prod-••••••••••••••••a3f7',
    createdAt: '2025-01-15',
    lastUsed: 'Il y a 1h',
    active: true,
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk-dev-••••••••••••••••b8e2',
    createdAt: '2025-02-20',
    lastUsed: 'Il y a 3j',
    active: true,
  },
];

export const Settings: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'appearance' | 'integrations'>('general');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotificationSettings);
  const [security, setSecurity] = useState<SecuritySettings>(defaultSecuritySettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Integration state
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(defaultApiKeys);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [integrationForm, setIntegrationForm] = useState<Record<string, string>>({});

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
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
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

  // Integration helpers
  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return { bg: 'rgba(22, 163, 74, 0.12)', color: '#16A34A', label: 'Connecte' };
      case 'disconnected': return { bg: 'rgba(107, 114, 128, 0.12)', color: '#6B7280', label: 'Deconnecte' };
      case 'error': return { bg: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', label: 'Erreur' };
      case 'configuring': return { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', label: 'Configuration' };
      default: return { bg: 'rgba(107, 114, 128, 0.12)', color: '#6B7280', label: 'Inconnu' };
    }
  };

  const handleIntegrationToggle = async (integrationId: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === integrationId) {
        const newConnected = !int.connected;
        return { ...int, connected: newConnected, status: newConnected ? 'connected' : 'disconnected' };
      }
      return int;
    }));
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIntegrationForm(integration.config || {});
    setIsIntegrationModalOpen(true);
  };

  const handleSaveIntegrationConfig = () => {
    if (!selectedIntegration) return;
    setIntegrations(prev => prev.map(int => {
      if (int.id === selectedIntegration.id) {
        return { ...int, config: integrationForm, status: 'connected' as const, connected: true, lastSync: 'A l\'instant' };
      }
      return int;
    }));
    setIsIntegrationModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, active: false } : k));
  };

  const handleGenerateApiKey = () => {
    const newKey: ApiKey = {
      id: String(Date.now()),
      name: `Key ${apiKeys.length + 1}`,
      key: `sk-new-••••••••••••••••${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Jamais',
      active: true,
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  // Render general settings
  const renderGeneralSettings = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Company Information */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Company Information</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>General organization details</p>
          </div>
          <Button variant="secondary" onClick={() => { setModalTitle('Edit Information'); setIsModalOpen(true); }}>
            Edit
          </Button>
        </div>
        {isLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>NAME</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.name || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.email || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>PHONE</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.phone || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>WEBSITE</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.website || 'Not set'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ADDRESS</div>
              <div style={{ fontSize: 13, color: Colors.text }}>{companyInfo.address || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TAX ID</div>
              <div style={{ fontSize: 13, color: Colors.text, fontFamily: 'monospace' }}>{companyInfo.taxId || 'Not set'}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Regional Settings */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Regional Settings</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Language, timezone, currency</p>
          </div>
          <Button variant="secondary" onClick={() => { setModalTitle('Edit Region'); setIsModalOpen(true); }}>
            Edit
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>LANGUAGE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>French (France)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TIMEZONE</div>
            <div style={{ fontSize: 13, color: Colors.text }}>GMT+0 (Dakar)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CURRENCY</div>
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
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Email Notifications</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Manage email notification preferences</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { key: 'emailAlerts', label: 'System Alerts', desc: 'Receive important system alerts' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly activity summary' },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Notifications about security events' },
            { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Alerts about attendance anomalies' },
            { key: 'invoiceReminders', label: 'Invoice Reminders', desc: 'Reminders for pending invoices' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>{item.desc}</div>
              </div>
              <Toggle
                checked={notifications[item.key as keyof NotificationSettings]}
                onChange={() => handleToggle('notifications', item.key)}
              />
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
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Authentication</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Security settings for login</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { key: 'twoFactor' as const, label: 'Two-Factor Authentication', desc: 'Require an additional code on each login' },
            { key: 'loginAlerts' as const, label: 'Login Alerts', desc: 'Notify on suspicious new logins' },
            { key: 'ipWhitelist' as const, label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>{item.desc}</div>
              </div>
              <Toggle
                checked={security[item.key]}
                onChange={() => handleToggle('security', item.key)}
              />
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
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Theme</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Choose your interface theme</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { id: 'dark', label: 'Dark', active: true, colors: ['#07080f', '#0c0d17', '#6490ff'] },
            { id: 'light', label: 'Light', active: false, colors: ['#ffffff', '#f1f5f9', '#3b82f6'] },
            { id: 'system', label: 'System', active: false, colors: ['#07080f', '#ffffff', '#6490ff'] },
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
      {/* Database & Services */}
      <Card style={{ padding: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Services & Connections</h3>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>Manage connections to external services</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {integrations.filter(i => i.category !== 'api').map(integration => {
            const statusInfo = getStatusColor(integration.status);
            return (
              <div
                key={integration.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: 'rgba(100, 140, 255, 0.03)',
                  borderRadius: 10,
                  border: `1px solid ${integration.connected ? 'rgba(22, 163, 74, 0.15)' : Colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: integration.connected ? 'rgba(22, 163, 74, 0.1)' : 'rgba(107, 114, 128, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {integration.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{integration.name}</div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginTop: 2 }}>{integration.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 600,
                        background: statusInfo.bg,
                        color: statusInfo.color,
                      }}>
                        {statusInfo.label}
                      </span>
                      {integration.lastSync && (
                        <span style={{ fontSize: 10, color: Colors.textMuted }}>Last sync: {integration.lastSync}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Toggle
                    checked={integration.connected}
                    onChange={() => handleIntegrationToggle(integration.id)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleConfigureIntegration(integration)}
                    style={{ fontSize: 12, padding: '6px 14px' }}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* API Keys */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>API Keys</h3>
            <p style={{ fontSize: 12, color: Colors.textMuted }}>Manage API keys for external authentication</p>
          </div>
          <Button variant="primary" onClick={handleGenerateApiKey} style={{ fontSize: 12 }}>
            + Generate Key
          </Button>
        </div>
        {apiKeys.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>No API keys configured</div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {apiKeys.map(key => (
              <div
                key={key.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: key.active ? 'rgba(22, 163, 74, 0.03)' : 'rgba(107, 114, 128, 0.03)',
                  borderRadius: 8,
                  border: `1px solid ${key.active ? 'rgba(22, 163, 74, 0.12)' : Colors.border}`,
                  opacity: key.active ? 1 : 0.6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: key.active ? 'rgba(22, 163, 74, 0.1)' : 'rgba(107, 114, 128, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    🔑
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{key.name}</div>
                    <div style={{
                      fontSize: 12,
                      color: Colors.textMuted,
                      fontFamily: 'monospace',
                      marginTop: 2,
                      cursor: 'pointer',
                    }}
                      onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                    >
                      {showApiKey === key.id ? key.key.replace(/•/g, '•') : key.key}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: Colors.textMuted }}>Created: {key.createdAt}</span>
                      <span style={{ fontSize: 10, color: Colors.textMuted }}>Last used: {key.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 600,
                    background: key.active ? 'rgba(22, 163, 74, 0.12)' : 'rgba(107, 114, 128, 0.1)',
                    color: key.active ? '#16A34A' : '#6B7280',
                  }}>
                    {key.active ? 'Active' : 'Revoked'}
                  </span>
                  {key.active && (
                    <Button
                      variant="secondary"
                      onClick={() => handleRevokeApiKey(key.id)}
                      style={{ fontSize: 11, padding: '4px 12px', color: Colors.danger }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Settings
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            System configuration . Preferences . Security
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
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Company name</label>
              <input name="name" defaultValue={companyInfo.name} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Email</label>
              <input name="email" type="email" defaultValue={companyInfo.email} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Phone</label>
              <input name="phone" defaultValue={companyInfo.phone} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Address</label>
              <input name="address" defaultValue={companyInfo.address} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Website</label>
              <input name="website" defaultValue={companyInfo.website} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Tax ID</label>
              <input name="taxId" defaultValue={companyInfo.taxId} style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Integration Configuration Modal */}
      <Modal
        isOpen={isIntegrationModalOpen}
        onClose={() => { setIsIntegrationModalOpen(false); setSelectedIntegration(null); }}
        title={selectedIntegration ? `Configure ${selectedIntegration.name}` : 'Configure'}
        size="md"
      >
        {selectedIntegration && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, background: 'rgba(100, 140, 255, 0.04)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{selectedIntegration.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedIntegration.name}</div>
                  <div style={{ fontSize: 12, color: Colors.textMuted }}>{selectedIntegration.description}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {selectedIntegration.category === 'database' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Host</label>
                    <input
                      value={integrationForm.host || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="localhost:5432"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Database Name</label>
                    <input
                      value={integrationForm.database || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, database: e.target.value }))}
                      placeholder="myapp_db"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Username</label>
                    <input
                      value={integrationForm.username || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="db_user"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                </>
              )}
              {selectedIntegration.category === 'email' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>SMTP Host</label>
                    <input
                      value={integrationForm.smtpHost || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, smtpHost: e.target.value }))}
                      placeholder="smtp.example.com"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>SMTP Port</label>
                      <input
                        value={integrationForm.smtpPort || ''}
                        onChange={e => setIntegrationForm(prev => ({ ...prev, smtpPort: e.target.value }))}
                        placeholder="587"
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Encryption</label>
                      <select
                        value={integrationForm.smtpEncryption || 'tls'}
                        onChange={e => setIntegrationForm(prev => ({ ...prev, smtpEncryption: e.target.value }))}
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>From Email</label>
                    <input
                      value={integrationForm.fromEmail || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="noreply@example.com"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                </>
              )}
              {selectedIntegration.category === 'storage' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Bucket Name</label>
                    <input
                      value={integrationForm.bucket || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, bucket: e.target.value }))}
                      placeholder="my-app-storage"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Region</label>
                    <input
                      value={integrationForm.region || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="us-east-1"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                </>
              )}
              {selectedIntegration.category === 'auth' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Provider</label>
                    <select
                      value={integrationForm.provider || 'google'}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, provider: e.target.value }))}
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    >
                      <option value="google">Google</option>
                      <option value="microsoft">Microsoft</option>
                      <option value="github">GitHub</option>
                      <option value="saml">SAML 2.0</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Client ID</label>
                    <input
                      value={integrationForm.clientId || ''}
                      onChange={e => setIntegrationForm(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="your-client-id"
                      style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => { setIsIntegrationModalOpen(false); setSelectedIntegration(null); }}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveIntegrationConfig}>Save Configuration</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Settings;
