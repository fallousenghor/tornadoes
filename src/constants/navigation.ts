// Navigation Constants - AEVUM Enterprise ERP
// Static navigation configuration (no longer from mockData)

export interface NavItem {
  icon: string;
  label: string;
  id: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: 'PRINCIPAL',
    items: [
      { icon: 'LayoutDashboard', label: 'Tableau de bord', id: 'dashboard' },
      { icon: 'Brain', label: 'Analytiques IA', id: 'ai' },
    ],
  },
  {
    label: 'RH & ORG',
    items: [
      { icon: 'Users', label: 'Employés', id: 'employees' },
      { icon: 'Building2', label: 'Départements', id: 'depts' },
      { icon: 'ClockCheck', label: 'Présence', id: 'presence' },
      { icon: 'Palmtree', label: 'Congés', id: 'conges' },
      { icon: 'TrendingUp', label: 'Performance', id: 'perf' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { icon: 'Banknote', label: 'Trésorerie', id: 'treasury' },
      { icon: 'FileText', label: 'Facturation', id: 'invoices' },
      { icon: 'Receipt', label: 'Dépenses', id: 'expenses' },
      { icon: 'Calculator', label: 'Comptabilité', id: 'accounting' },
    ],
  },
  {
    label: 'CRM & VENTES',
    items: [
      { icon: 'ContactRound', label: 'Contacts', id: 'contacts' },
      { icon: 'Target', label: 'Opportunités', id: 'deals' },
    ],
  },
  {
    label: 'OPÉRATIONS',
    items: [
      { icon: 'ShoppingCart', label: 'Achats', id: 'purchases' },
      { icon: 'Package', label: 'Stock & Matériel', id: 'inventory' },
      { icon: 'FolderKanban', label: 'Projets', id: 'projects' },
      { icon: 'Files', label: 'Documents', id: 'docs' },
    ],
  },
  {
    label: 'FORMATION',
    items: [
      { icon: 'GraduationCap', label: 'Apprenants', id: 'students' },
      { icon: 'UserPen', label: 'Professeurs', id: 'teachers' },
      { icon: 'BookOpen', label: 'Programmes', id: 'programs' },
      { icon: 'ClipboardList', label: 'Inscriptions', id: 'enrollments' },
      { icon: 'CalendarDays', label: 'Plannings', id: 'schedule' },
      { icon: 'SquareLibrary', label: 'Notes & Bulletins', id: 'grades' },
      { icon: 'CreditCard', label: 'Paiements', id: 'payments' },
      { icon: 'Wallet', label: 'Salaires Profs', id: 'salaries' },
    ],
  },
  {
    label: 'SYSTÈME',
    items: [
      { icon: 'ShieldCheck', label: 'Rôles & Accès', id: 'roles' },
      { icon: 'ScrollText', label: 'Audit & Logs', id: 'audit' },
      { icon: 'Settings', label: 'Paramètres', id: 'settings' },
    ],
  },
];

export default navSections;

