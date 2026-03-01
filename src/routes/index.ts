// Routes Configuration - AEVUM Enterprise ERP
// Centralized route definitions for navigation

// Full navigation route type
export interface NavRoute {
  id: string;
  path: string;
  label: string;
  icon: string;
  section: string;
}

// Get all navigation items for the sidebar
export const getNavItems = (): NavRoute[] => [
  // Dashboard
  { id: 'dashboard', path: '/', label: 'Tableau de Bord', icon: '📊', section: 'PRINCIPAL' },
  
  // RH Section
  { id: 'employees', path: '/rh/employees', label: 'Employés', icon: '👥', section: 'RH & ORG' },
  { id: 'depts', path: '/rh/departments', label: 'Départements', icon: '🏢', section: 'RH & ORG' },
  { id: 'presence', path: '/rh/presence', label: 'Présence', icon: '✅', section: 'RH & ORG' },
  { id: 'conges', path: '/rh/leaves', label: 'Congés', icon: '📅', section: 'RH & ORG' },
  { id: 'perf', path: '/rh/performance', label: 'Performance', icon: '📈', section: 'RH & ORG' },
  
  // Finance Section
  { id: 'treasury', path: '/finance/treasury', label: 'Trésorerie', icon: '💵', section: 'FINANCE' },
  { id: 'invoices', path: '/finance/invoices', label: 'Factures', icon: '📄', section: 'FINANCE' },
  { id: 'accounting', path: '/finance/accounting', label: 'Comptabilité', icon: '📒', section: 'FINANCE' },
  
  // Operations Section
  { id: 'stock', path: '/stock', label: 'Stock', icon: '📦', section: 'OPÉRATIONS' },
  { id: 'projects', path: '/projects', label: 'Projets', icon: '🎯', section: 'OPÉRATIONS' },
  { id: 'docs', path: '/documents', label: 'Documents', icon: '📁', section: 'OPÉRATIONS' },
  
  // Formation Section
  { id: 'students', path: '/formation/students', label: 'Étudiants', icon: '🎓', section: 'FORMATION' },
  { id: 'teachers', path: '/formation/teachers', label: 'Enseignants', icon: '👨‍🏫', section: 'FORMATION' },
  { id: 'schedule', path: '/formation/schedule', label: 'Emploi du temps', icon: '🕐', section: 'FORMATION' },
  { id: 'grades', path: '/formation/grades', label: 'Notes', icon: '📝', section: 'FORMATION' },
  
  // System Section
  { id: 'roles', path: '/system/roles', label: 'Rôles & Permissions', icon: '🔐', section: 'SYSTÈME' },
  { id: 'audit', path: '/system/audit', label: 'Audit', icon: '🔍', section: 'SYSTÈME' },
  { id: 'settings', path: '/system/settings', label: 'Paramètres', icon: '⚙️', section: 'SYSTÈME' },
  { id: 'ai', path: '/system/ai', label: 'IA Analytics', icon: '🤖', section: 'SYSTÈME' },
];

// Get route ID from path
export const getRouteId = (path: string): string => {
  const items = getNavItems();
  const item = items.find(i => i.path === path);
  return item?.id || 'dashboard';
};

// Get nav items grouped by section
export const getNavSections = () => {
  const items = getNavItems();
  const sections: Record<string, NavRoute[]> = {};
  
  items.forEach(item => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push(item);
  });
  
  return sections;
};

export default getNavItems;

