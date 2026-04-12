// Routes Configuration - TORNADOES JOB ERP
// Centralized route definitions for navigation

// Get all navigation items for the sidebar
export interface NavRoute {
  id: string;
  path: string;
  label: string;
  icon: string;
  section: string;
}

export const getNavItems = (): NavRoute[] => [
  // Dashboard
  { id: 'dashboard', path: '/', label: 'Tableau de Bord', icon: '📊', section: 'PRINCIPAL' },
  { id: 'ai', path: '/ai', label: 'Analytiques IA', icon: '🤖', section: 'PRINCIPAL' },

  // RH Section
  { id: 'employees', path: '/hr/employees', label: 'Employés', icon: '👥', section: 'RH & ORG' },
  { id: 'depts', path: '/hr/departments', label: 'Départements', icon: '🏢', section: 'RH & ORG' },
  { id: 'presence', path: '/hr/presence', label: 'Présence', icon: '✅', section: 'RH & ORG' },
  { id: 'conges', path: '/hr/leaves', label: 'Congés', icon: '🏖️', section: 'RH & ORG' },
  { id: 'perf', path: '/hr/performance', label: 'Performance', icon: '📈', section: 'RH & ORG' },

  // Finance Section
  { id: 'finance', path: '/finance', label: 'Tableau de Bord', icon: '💵', section: 'FINANCE' },
  { id: 'invoices', path: '/finance/invoices', label: 'Factures', icon: '📄', section: 'FINANCE' },
  { id: 'expenses', path: '/finance/expenses', label: 'Dépenses', icon: '💸', section: 'FINANCE' },

  // CRM Section
  { id: 'contacts', path: '/crm/contacts', label: 'Contacts', icon: '🤝', section: 'CRM & VENTES' },
  { id: 'deals', path: '/crm/deals', label: 'Opportunités', icon: '🎯', section: 'CRM & VENTES' },

  // Operations Section
  { id: 'purchases', path: '/purchases', label: 'Achats', icon: '🛒', section: 'OPÉRATIONS' },
  { id: 'inventory', path: '/inventory', label: 'Inventaire', icon: '📦', section: 'OPÉRATIONS' },
  { id: 'projects', path: '/projects', label: 'Projets', icon: '🎯', section: 'OPÉRATIONS' },
  { id: 'docs', path: '/documents', label: 'Documents', icon: '📁', section: 'OPÉRATIONS' },

  // Formation Section
  { id: 'students', path: '/formation/students', label: 'Apprenants', icon: '🎓', section: 'FORMATION' },
  { id: 'teachers', path: '/formation/teachers', label: 'Professeurs', icon: '👨‍🏫', section: 'FORMATION' },
  { id: 'programs', path: '/formation/programs', label: 'Programmes', icon: '📚', section: 'FORMATION' },
  { id: 'enrollments', path: '/formation/enrollments', label: 'Inscriptions', icon: '📋', section: 'FORMATION' },
  { id: 'schedule', path: '/formation/schedule', label: 'Plannings', icon: '📅', section: 'FORMATION' },
  { id: 'grades', path: '/formation/grades', label: 'Notes & Bulletins', icon: '📝', section: 'FORMATION' },
  { id: 'payments', path: '/formation/payments', label: 'Paiements', icon: '💰', section: 'FORMATION' },
  { id: 'salaries', path: '/formation/salaries', label: 'Salaires Profs', icon: '💵', section: 'FORMATION' },

  // System Section
  { id: 'roles', path: '/system/roles', label: 'Rôles & Permissions', icon: '🔐', section: 'SYSTÈME' },
  { id: 'audit', path: '/system/audit', label: 'Audit Logs', icon: '🔍', section: 'SYSTÈME' },
  { id: 'settings', path: '/system/settings', label: 'Paramètres', icon: '⚙️', section: 'SYSTÈME' },
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
