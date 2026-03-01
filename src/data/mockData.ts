// Mock Data - AEVUM Enterprise ERP
// Sample data for development and demonstration

import type { 
  Employee, 
  Invoice, 
  Department, 
  Project, 
  ActivityLog,
  KPI,
  NavSection,
  Student,
  StockItem,
  LeaveBalance,
  PresenceRecord,
  Transaction,
  CashFlow,
  DashboardView,
} from '@/types';

// ==================== Navigation ====================
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

// ==================== KPIs ====================
export const kpis: KPI[] = [
  {
    id: '1',
    label: "Chiffre d'Affaires",
    value: '7,8M €',
    change: 18.4,
    icon: '◈',
    color: '#6490ff',
    sparklineData: [42, 38, 51, 47, 62, 59, 68, 72, 81, 76, 89, 95],
  },
  {
    id: '2',
    label: 'Effectif Total',
    value: '247',
    change: 6.2,
    icon: '◉',
    color: '#3ecf8e',
    sparklineData: [210, 215, 218, 221, 225, 229, 232, 235, 238, 241, 245, 247],
  },
  {
    id: '3',
    label: 'Taux de Présence',
    value: '91,4%',
    change: 1.8,
    icon: '◎',
    color: '#2dd4bf',
    sparklineData: [88, 90, 87, 91, 89, 92, 90, 93, 91, 92, 94, 91],
  },
  {
    id: '4',
    label: 'Factures Impayées',
    value: '23',
    change: -12.5,
    icon: '◆',
    color: '#fb923c',
    sparklineData: [35, 32, 28, 30, 26, 29, 25, 27, 24, 26, 23, 23],
  },
  {
    id: '5',
    label: 'Apprenants Actifs',
    value: '1 247',
    change: 23.1,
    icon: '▦',
    color: '#a78bfa',
    sparklineData: [820, 880, 920, 970, 1020, 1080, 1120, 1150, 1180, 1210, 1235, 1247],
  },
  {
    id: '6',
    label: 'Bénéfice Net',
    value: '3,1M €',
    change: 21.3,
    icon: '◇',
    color: '#c9a84c',
    sparklineData: [140, 120, 200, 180, 280, 270, 320, 330, 400, 380, 460, 500],
  },
];

// ==================== Revenue Data ====================
export const revenueData = [
  { month: 'Jan', revenus: 420000, depenses: 280000, benefice: 140000 },
  { month: 'Fév', revenus: 380000, depenses: 260000, benefice: 120000 },
  { month: 'Mar', revenus: 510000, depenses: 310000, benefice: 200000 },
  { month: 'Avr', revenus: 470000, depenses: 290000, benefice: 180000 },
  { month: 'Mai', revenus: 620000, depenses: 340000, benefice: 280000 },
  { month: 'Jun', revenus: 590000, depenses: 320000, benefice: 270000 },
  { month: 'Jul', revenus: 680000, depenses: 360000, benefice: 320000 },
  { month: 'Aoû', revenus: 720000, depenses: 390000, benefice: 330000 },
  { month: 'Sep', revenus: 810000, depenses: 410000, benefice: 400000 },
  { month: 'Oct', revenus: 760000, depenses: 380000, benefice: 380000 },
  { month: 'Nov', revenus: 890000, depenses: 430000, benefice: 460000 },
  { month: 'Déc', revenus: 950000, depenses: 450000, benefice: 500000 },
];

// ==================== Department Performance ====================
export const deptPerformance: Department[] = [
  { id: '1', name: 'Tech', code: 'TECH', budget: 180000, spent: 142000, createdAt: new Date() },
  { id: '2', name: 'RH', code: 'RH', budget: 95000, spent: 88000, createdAt: new Date() },
  { id: '3', name: 'Finance', code: 'FIN', budget: 120000, spent: 98000, createdAt: new Date() },
  { id: '4', name: 'Ventes', code: 'VT', budget: 220000, spent: 198000, createdAt: new Date() },
  { id: '5', name: 'Formation', code: 'FORM', budget: 150000, spent: 115000, createdAt: new Date() },
];

// ==================== Presence Data ====================
export const presenceData = [
  { jour: 'Lun', presents: 87, absents: 8, retards: 5 },
  { jour: 'Mar', presents: 91, absents: 5, retards: 4 },
  { jour: 'Mer', presents: 84, absents: 10, retards: 6 },
  { jour: 'Jeu', presents: 89, absents: 7, retards: 4 },
  { jour: 'Ven', presents: 79, absents: 14, retards: 7 },
];

// ==================== Leave Data ====================
export const leaveData = [
  { name: 'Annuel', value: 42, color: '#6490ff' },
  { name: 'Maladie', value: 18, color: '#3ecf8e' },
  { name: 'Maternité', value: 8, color: '#a78bfa' },
  { name: 'Sans solde', value: 12, color: '#fb923c' },
  { name: 'Exceptionnel', value: 6, color: '#2dd4bf' },
];

// ==================== Cash Flow Data ====================
export const cashFlowData: CashFlow[] = [
  { month: 'Jan', incomes: 620000, expenses: 480000, balance: 140000 },
  { month: 'Fév', incomes: 540000, expenses: 420000, balance: 260000 },
  { month: 'Mar', incomes: 780000, expenses: 510000, balance: 530000 },
  { month: 'Avr', incomes: 650000, expenses: 490000, balance: 690000 },
  { month: 'Mai', incomes: 890000, expenses: 560000, balance: 1020000 },
  { month: 'Jun', incomes: 720000, expenses: 530000, balance: 1210000 },
];

// ==================== Stock Data ====================
export const stockItems = [
  { id: '1', name: 'MacBook Pro 14"', category: 'informatique', quantity: 45, available: 28, assigned: 17, minQuantity: 10, reference: 'IT-001' },
  { id: '2', name: 'Dell XPS 15', category: 'informatique', quantity: 32, available: 20, assigned: 12, minQuantity: 8, reference: 'IT-002' },
  { id: '3', name: 'HP EliteBook 840', category: 'informatique', quantity: 28, available: 18, assigned: 10, minQuantity: 5, reference: 'IT-003' },
  { id: '4', name: 'iMac 24"', category: 'informatique', quantity: 15, available: 12, assigned: 3, minQuantity: 3, reference: 'IT-004' },
  { id: '5', name: 'iPad Pro 12.9"', category: 'informatique', quantity: 25, available: 20, assigned: 5, minQuantity: 5, reference: 'IT-005' },
  { id: '6', name: 'Chaise ergonomique', category: 'mobilier', quantity: 120, available: 85, assigned: 35, minQuantity: 20, reference: 'MB-001' },
  { id: '7', name: 'Bureau debout', category: 'mobilier', quantity: 45, available: 38, assigned: 7, minQuantity: 10, reference: 'MB-002' },
  { id: '8', name: 'Armoire roulant', category: 'mobilier', quantity: 65, available: 50, assigned: 15, minQuantity: 15, reference: 'MB-003' },
  { id: '9', name: 'Fauteuil direction', category: 'mobilier', quantity: 50, available: 37, assigned: 13, minQuantity: 10, reference: 'MB-004' },
  { id: '10', name: 'Imprimante laser', category: 'equipements', quantity: 18, available: 12, assigned: 6, minQuantity: 4, reference: 'EQ-001' },
  { id: '11', name: 'Scanner professionnel', category: 'equipements', quantity: 12, available: 8, assigned: 4, minQuantity: 3, reference: 'EQ-002' },
  { id: '12', name: 'Vidéoprojecteur', category: 'equipements', quantity: 22, available: 18, assigned: 4, minQuantity: 5, reference: 'EQ-003' },
  { id: '13', name: 'Webcam HD', category: 'informatique', quantity: 55, available: 42, assigned: 13, minQuantity: 10, reference: 'IT-006' },
  { id: '14', name: 'Casque audio', category: 'informatique', quantity: 80, available: 65, assigned: 15, minQuantity: 15, reference: 'IT-007' },
  { id: '15', name: 'Moniteur 27"', category: 'informatique', quantity: 40, available: 25, assigned: 15, minQuantity: 8, reference: 'IT-008' },
  { id: '16', name: 'Voiture utilitaire', category: 'mobilite', quantity: 8, available: 5, assigned: 3, minQuantity: 2, reference: 'MO-001' },
  { id: '17', name: 'Moto électrique', category: 'mobilite', quantity: 12, available: 9, assigned: 3, minQuantity: 2, reference: 'MO-002' },
  { id: '18', name: 'Tableau blanc interactif', category: 'equipements', quantity: 8, available: 6, assigned: 2, minQuantity: 2, reference: 'EQ-004' },
];

export const stockSummary = {
  totalItems: stockItems.reduce((acc, item) => acc + item.quantity, 0),
  available: stockItems.reduce((acc, item) => acc + item.available, 0),
  assigned: stockItems.reduce((acc, item) => acc + item.assigned, 0),
  maintenance: 8,
};

export const stockCategoriesData = [
  { name: 'informatique', value: stockItems.filter(i => i.category === 'informatique').reduce((acc, i) => acc + i.quantity, 0) },
  { name: 'mobilier', value: stockItems.filter(i => i.category === 'mobilier').reduce((acc, i) => acc + i.quantity, 0) },
  { name: 'equipements', value: stockItems.filter(i => i.category === 'equipements').reduce((acc, i) => acc + i.quantity, 0) },
  { name: 'mobilite', value: stockItems.filter(i => i.category === 'mobilite').reduce((acc, i) => acc + i.quantity, 0) },
];

export const stockMovements = [
  { type: 'in', item: 'MacBook Pro 14"', quantity: 10, date: '22 fév 2025' },
  { type: 'out', item: 'Dell XPS 15', quantity: 3, date: '21 fév 2025' },
  { type: 'in', item: 'Chaise ergonomique', quantity: 25, date: '20 fév 2025' },
  { type: 'out', item: 'iPad Pro 12.9"', quantity: 2, date: '19 fév 2025' },
  { type: 'in', item: 'Webcam HD', quantity: 15, date: '18 fév 2025' },
  { type: 'out', item: 'Imprimante laser', quantity: 1, date: '17 fév 2025' },
];

export const equipmentAssignments = [
  { id: '1', employeeName: 'Fatou Diallo', department: 'RH', itemName: 'MacBook Pro 14"', itemRef: 'IT-001-012', assignedDate: '15 jan 2025', status: 'active' },
  { id: '2', employeeName: 'Moussa Sow', department: 'Finance', itemName: 'Dell XPS 15', itemRef: 'IT-002-008', assignedDate: '10 jan 2025', status: 'active' },
  { id: '3', employeeName: 'Sara Mendy', department: 'Tech', itemName: 'MacBook Pro 14"', itemRef: 'IT-001-015', assignedDate: '08 jan 2025', status: 'active' },
  { id: '4', employeeName: 'Ibou Gaye', department: 'Ventes', itemName: 'iPad Pro 12.9"', itemRef: 'IT-005-003', assignedDate: '05 jan 2025', status: 'active' },
  { id: '5', employeeName: 'Rokhaya Fall', department: 'Formation', itemName: 'MacBook Pro 14"', itemRef: 'IT-001-018', assignedDate: '03 jan 2025', status: 'active' },
  { id: '6', employeeName: 'Amadou Sall', department: 'Tech', itemName: 'Dell XPS 15', itemRef: 'IT-002-012', assignedDate: '28 déc 2024', status: 'return' },
  { id: '7', employeeName: 'Aïcha Ndiaye', department: 'Direction', itemName: 'MacBook Pro 14"', itemRef: 'IT-001-020', assignedDate: '20 déc 2024', status: 'active' },
  { id: '8', employeeName: 'Omar Ba', department: 'Tech', itemName: 'iMac 24"', itemRef: 'IT-004-005', assignedDate: '15 déc 2024', status: 'active' },
];

export const maintenanceAlerts = [
  { id: '1', itemName: 'Imprimante laser #3', itemRef: 'EQ-001-003', type: 'corrective', priority: 'high', description: 'Remplacement du tambour tambour nécessite remplacement urgently', scheduledDate: '25 fév 2025' },
  { id: '2', itemName: 'Vidéoprojecteur salle A', itemRef: 'EQ-003-007', type: 'preventive', priority: 'medium', description: 'Maintenance préventive annuelle - remplacement lampe', scheduledDate: '01 mars 2025' },
  { id: '3', itemName: 'MacBook Pro IT-001-012', itemRef: 'IT-001-012', type: 'corrective', priority: 'high', description: 'Clavier ne fonctionne plus - réparation nécessaire', scheduledDate: '24 fév 2025' },
  { id: '4', itemName: 'Voiture utilitaire #2', itemRef: 'MO-001-002', type: 'preventive', priority: 'medium', description: 'Vidange et révision des 10 000 km', scheduledDate: '05 mars 2025' },
  { id: '5', itemName: 'Tableau blanc interactif', itemRef: 'EQ-004-002', type: 'preventive', priority: 'low', description: 'Calibration et mise à jour firmware', scheduledDate: '10 mars 2025' },
];

// ==================== Students/Programs ====================
export const studentsData: Student[] = [
  { 
    id: '1', 
    userId: 'u1', 
    firstName: 'Amadou', 
    lastName: 'Sall', 
    email: 'amadou.sall@aevum.sn',
    programId: 'p1',
    status: 'actif',
    enrollmentDate: new Date('2024-09-01'),
  },
  { 
    id: '2', 
    userId: 'u2', 
    firstName: 'Fatou', 
    lastName: 'Ndiaye', 
    email: 'fatou.ndiaye@aevum.sn',
    programId: 'p1',
    status: 'actif',
    enrollmentDate: new Date('2024-09-01'),
  },
];

export const programsData = [
  { filiere: 'Développement Web', inscrits: 124, actifs: 112, completion: 89 },
  { filiere: 'Data Science', inscrits: 87, actifs: 79, completion: 76 },
  { filiere: 'Cybersécurité', inscrits: 56, actifs: 51, completion: 84 },
  { filiere: 'Marketing Digital', inscrits: 103, actifs: 95, completion: 91 },
];

// ==================== Radar Department Data ====================
export const radarDeptData = [
  { subject: 'Ventes', A: 94, B: 70 },
  { subject: 'Finance', A: 82, B: 88 },
  { subject: 'RH', A: 91, B: 75 },
  { subject: 'Tech', A: 76, B: 92 },
  { subject: 'Formation', A: 88, B: 65 },
  { subject: 'Direction', A: 95, B: 80 },
];

// ==================== Projects ====================
export const projectsData: Project[] = [
  { 
    id: '1', 
    name: 'Refonte CRM', 
    status: 'en_cours', 
    priority: 'haute', 
    progress: 78,
    startDate: new Date('2025-01-01'),
    deadline: new Date('2025-03-15'),
    managerId: 'm1',
    members: ['e1', 'e2', 'e3'],
  },
  { 
    id: '2', 
    name: 'Formation Python', 
    status: 'en_cours', 
    priority: 'moyenne', 
    progress: 45,
    startDate: new Date('2025-02-01'),
    deadline: new Date('2025-04-30'),
    managerId: 'm2',
    members: ['e4', 'e5'],
  },
  { 
    id: '3', 
    name: 'Audit SI', 
    status: 'finalisation', 
    priority: 'haute', 
    progress: 92,
    startDate: new Date('2025-01-15'),
    deadline: new Date('2025-02-28'),
    managerId: 'm3',
    members: ['e6', 'e7'],
  },
  { 
    id: '4', 
    name: 'Expansion Lyon', 
    status: 'demarrage', 
    priority: 'haute', 
    progress: 23,
    startDate: new Date('2025-03-01'),
    deadline: new Date('2025-06-01'),
    managerId: 'm1',
    members: ['e8', 'e9'],
  },
  { 
    id: '5', 
    name: 'ERP Migration', 
    status: 'en_cours', 
    priority: 'critique', 
    progress: 61,
    startDate: new Date('2025-01-20'),
    deadline: new Date('2025-05-15'),
    managerId: 'm4',
    members: ['e1', 'e3', 'e10'],
  },
];

// ==================== Activity Logs ====================
export const activitiesData: ActivityLog[] = [
  { 
    id: '1', 
    userId: 'u1', 
    userName: 'Fatou Diallo', 
    userRole: 'RH', 
    action: 'Contrat signé — Ingénieur Backend', 
    timestamp: new Date(Date.now() - 120000),
    amount: '48 500 €',
    avatarInitials: 'FD',
    avatarColor: '#6490ff',
  },
  { 
    id: '2', 
    userId: 'u2', 
    userName: 'Moussa Sow', 
    userRole: 'Finance', 
    action: 'Facture #INV-2041 envoyée', 
    timestamp: new Date(Date.now() - 840000),
    amount: '12 200 €',
    avatarInitials: 'MS',
    avatarColor: '#3ecf8e',
  },
  { 
    id: '3', 
    userId: 'u3', 
    userName: 'Aïcha Ndiaye', 
    userRole: 'DG', 
    action: 'Validation budget Q1 2025', 
    timestamp: new Date(Date.now() - 3600000),
    amount: '320 000 €',
    avatarInitials: 'AN',
    avatarColor: '#c9a84c',
  },
  { 
    id: '4', 
    userId: 'u4', 
    userName: 'Omar Ba', 
    userRole: 'Tech', 
    action: 'Déploiement module paie v2.3', 
    timestamp: new Date(Date.now() - 7200000),
    avatarInitials: 'OB',
    avatarColor: '#a78bfa',
  },
  { 
    id: '5', 
    userId: 'u5', 
    userName: 'Lamine Diop', 
    userRole: 'Formation', 
    action: 'Nouveau groupe inscrit', 
    timestamp: new Date(Date.now() - 10800000),
    amount: '22 400 €',
    avatarInitials: 'LD',
    avatarColor: '#2dd4bf',
  },
];

// ==================== Employees ====================
export const employeesData: Employee[] = [
  { 
    id: '1', 
    userId: 'u1', 
    firstName: 'Fatou', 
    lastName: 'Diallo', 
    email: 'fatou.diallo@aevum.sn',
    poste: 'DRH', 
    departmentId: '2', 
    contractType: 'CDI', 
    salary: 85000,
    startDate: new Date('2020-01-15'),
    status: 'Actif',
  },
  { 
    id: '2', 
    userId: 'u2', 
    firstName: 'Moussa', 
    lastName: 'Sow', 
    email: 'moussa.sow@aevum.sn',
    poste: 'DAF', 
    departmentId: '3', 
    contractType: 'CDI', 
    salary: 92000,
    startDate: new Date('2019-06-01'),
    status: 'Actif',
  },
  { 
    id: '3', 
    userId: 'u3', 
    firstName: 'Sara', 
    lastName: 'Mendy', 
    email: 'sara.mendy@aevum.sn',
    poste: 'Dev Senior', 
    departmentId: '1', 
    contractType: 'CDI', 
    salary: 72000,
    startDate: new Date('2021-03-10'),
    status: 'Actif',
  },
  { 
    id: '4', 
    userId: 'u4', 
    firstName: 'Ibou', 
    lastName: 'Gaye', 
    email: 'ibou.gaye@aevum.sn',
    poste: 'Commercial', 
    departmentId: '4', 
    contractType: 'CDD', 
    salary: 48000,
    startDate: new Date('2023-09-01'),
    status: 'Congé',
  },
  { 
    id: '5', 
    userId: 'u5', 
    firstName: 'Rokhaya', 
    lastName: 'Fall', 
    email: 'rokhaya.fall@aevum.sn',
    poste: 'Formatrice', 
    departmentId: '5', 
    contractType: 'Freelance', 
    salary: 55000,
    startDate: new Date('2022-01-20'),
    status: 'Actif',
  },
];

// ==================== Invoices ====================
export const invoicesData: Invoice[] = [
  { 
    id: '1', 
    reference: 'INV-2041', 
    clientId: 'c1', 
    clientName: 'Sonatel SA', 
    amount: 12200, 
    date: new Date('2025-02-22'),
    status: 'en_attente',
    items: [],
  },
  { 
    id: '2', 
    reference: 'INV-2040', 
    clientId: 'c2', 
    clientName: 'BNK Group', 
    amount: 48500, 
    date: new Date('2025-02-20'),
    status: 'paye',
    items: [],
  },
  { 
    id: '3', 
    reference: 'INV-2039', 
    clientId: 'c3', 
    clientName: 'CBAO', 
    amount: 8900, 
    date: new Date('2025-02-18'),
    status: 'partiel',
    items: [],
  },
  { 
    id: '4', 
    reference: 'INV-2038', 
    clientId: 'c4', 
    clientName: 'Dakar Airport', 
    amount: 31000, 
    date: new Date('2025-02-15'),
    status: 'paye',
    items: [],
  },
];

// ==================== Dashboard Views ====================
export const dashboardViews: DashboardView[] = [
  { type: 'dg', title: 'Vue Direction Générale' },
  { type: 'rh', title: 'Vue Ressources Humaines' },
  { type: 'finance', title: 'Vue Finance' },
];

// ==================== AI Alerts ====================
export const aiAlerts = [
  {
    color: 'rgba(100,140,255,0.12)',
    border: 'rgba(100,140,255,0.25)',
    icon: '🤖',
    text: 'IA détecte une hausse anormale des dépenses opérationnelles (+18%) ce mois-ci.',
    btn: 'Analyser',
  },
  {
    color: 'rgba(62,207,142,0.08)',
    border: 'rgba(62,207,142,0.2)',
    icon: '📈',
    text: 'Prévision Q1 2025 : CA estimé à 2,4M € (+22% vs Q1 2024) basé sur les tendances actuelles.',
    btn: 'Voir',
  },
  {
    color: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
    icon: '⚠️',
    text: '3 factures arrivent à échéance dans 48h pour un total de 31 200 €.',
    btn: 'Gérer',
  },
];

