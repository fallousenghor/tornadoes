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
      { icon: '⬡', label: 'Tableau de bord', id: 'dashboard' },
      { icon: '◈', label: 'Analytiques IA', id: 'ai' },
    ],
  },
  {
    label: 'RH & ORG',
    items: [
      { icon: '▦', label: 'Employés', id: 'employees' },
      { icon: '◉', label: 'Départements', id: 'depts' },
      { icon: '◎', label: 'Présence', id: 'presence' },
      { icon: '◇', label: 'Congés', id: 'conges' },
      { icon: '▣', label: 'Performance', id: 'perf' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { icon: '◆', label: 'Trésorerie', id: 'treasury' },
      { icon: '⬡', label: 'Facturation', id: 'invoices' },
      { icon: '▦', label: 'Comptabilité', id: 'accounting' },
    ],
  },
  {
    label: 'OPÉRATIONS',
    items: [
      { icon: '◈', label: 'Stock & Matériel', id: 'stock' },
      { icon: '▣', label: 'Projets', id: 'projects' },
      { icon: '◎', label: 'Documents', id: 'docs' },
    ],
  },
  {
    label: 'FORMATION',
    items: [
      { icon: '◉', label: 'Apprenants', id: 'students' },
      { icon: '◆', label: 'Professeurs', id: 'teachers' },
      { icon: '⬡', label: 'Plannings', id: 'schedule' },
      { icon: '◇', label: 'Notes & Bulletins', id: 'grades' },
    ],
  },
  {
    label: 'SYSTÈME',
    items: [
      { icon: '▦', label: 'Rôles & Accès', id: 'roles' },
      { icon: '◈', label: 'Audit & Logs', id: 'audit' },
      { icon: '◎', label: 'Paramètres', id: 'settings' },
    ],
  },
];

export default navSections;

