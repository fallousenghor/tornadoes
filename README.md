# 🌪️ Tornadoes Job ERP - Frontend

> **Interface Utilisateur** de l'ERP Tornadoes Job  
> **React 18** | **TypeScript** | **Vite** | **Zustand** | **Recharts**

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Développement](#développement)
- [Build](#build)
- [Features](#features)
- [Services API](#services-api)
- [Types](#types)

---

## 🎯 Vue d'ensemble

Le frontend de **Tornadoes Job ERP** est une application React moderne et réactive qui fournit une interface utilisateur complète pour la gestion d'entreprise.

### Caractéristiques

- ✅ **Moderne** : React 18, TypeScript, Vite
- ✅ **Rapide** : Chargement optimisé, code splitting
- ✅ **Type-safe** : TypeScript pour une meilleure maintenabilité
- ✅ **État global** : Zustand pour une gestion d'état légère
- ✅ **Charts** : Recharts pour les visualisations de données
- ✅ **Responsive** : S'adapte à tous les écrans

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18.2.0 | Framework UI |
| **TypeScript** | 5.4.2 | Typage statique |
| **Vite** | 5.2.0 | Build tool & dev server |
| **React Router** | 6.22.0 | Routing |
| **Zustand** | 4.5.0 | State management |
| **Recharts** | 2.12.0 | Graphiques & charts |
| **Axios** | 1.13.6 | HTTP client |
| **Lucide React** | 0.344.0 | Icônes |
| **QRCode React** | 3.1.0 | Génération QR codes |

---

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── charts/        # Composants de graphiques
│   │   ├── common/        # Composants communs (Toast, etc.)
│   │   ├── layout/        # Layout (Header, Sidebar, etc.)
│   │   └── index.ts
│   ├── features/           # Features par module métier
│   │   ├── auth/          # Authentification
│   │   ├── dashboard/     # Tableau de bord
│   │   ├── hr/            # Ressources Humaines
│   │   ├── finance/       # Finance
│   │   ├── crm/           # CRM (Contacts, Deals)
│   │   ├── purchases/     # Achats
│   │   ├── inventory/     # Inventaire/Stock
│   │   ├── projects/      # Projets
│   │   ├── documents/     # Documents
│   │   ├── formation/     # Formation (Étudiants, Programmes)
│   │   └── settings/      # Paramètres
│   ├── services/           # Services API
│   │   ├── api.ts         # Instance Axios configurée
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── contactService.ts
│   │   ├── dealService.ts
│   │   └── ...
│   ├── store/              # Stores Zustand
│   │   ├── appStore.ts    # État global de l'app
│   │   └── toastStore.ts  # Notifications
│   ├── types/              # Types TypeScript
│   │   └── index.ts       # Tous les types
│   ├── routes/             # Configuration des routes
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Fonctions utilitaires
│   ├── constants/          # Constantes
│   ├── contexts/           # React contexts (Theme)
│   ├── data/               # Données statiques/mock
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── public/
├── dist/                   # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env
└── .env.example
```

---

## 🚀 Installation

### Prérequis

- **Node.js 18+**
- **npm** ou **yarn**

### Étapes

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

---

## 💻 Développement

### Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:5173**

### Variables d'environnement

Le fichier `.env` contient :

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Tornadoes Job ERP
VITE_APP_VERSION=2.0.0
```

---

## 📦 Build

### Production build

```bash
npm run build
```

Le build sera généré dans le dossier `dist/`.

### Preview en production

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🎨 Features

### 1. Tableau de Bord
- Vue générale avec KPIs
- Graphiques (revenus, dépenses, cash flow)
- Activité récente
- Alertes et notifications

### 2. Ressources Humaines
- **Employés** : Liste, CRUD, photos, QR codes
- **Départements** : Gestion des départements et postes
- **Présences** : Pointages, absences, retards
- **Congés** : Demandes, validations, soldes
- **Performance** : Évaluations, objectifs

### 3. Finance
- **Trésorerie** : Vue d'ensemble, cash flow
- **Factures** : Création, envoi, suivi des paiements
- **Dépenses** : Notes de frais, validations

### 4. CRM & Ventes (NOUVEAU)
- **Contacts** : Clients, fournisseurs, partenaires, prospects
- **Opportunités** : Pipeline de ventes, deals

### 5. Achats (NOUVEAU)
- **Commandes** : Commandes fournisseurs
- **Suivi** : Livraisons, réceptions

### 6. Inventaire
- **Actifs** : Équipements, matériel
- **Affectations** : Historique des assignments

### 7. Projets
- **Suivi** : Statut, progression, jalons
- **Équipes** : Membres, rôles

### 8. Documents
- **Gestion** : Upload, versions, approbations
- **Catégories** : RH, Finance, Juridique, etc.

### 9. Formation
- **Étudiants** : Inscriptions, profils
- **Programmes** : Cours, modules
- **Inscriptions** : Suivi, notes

### 10. Administration
- **Rôles** : Permissions, accès
- **Audit** : Journal d'activité
- **Paramètres** : Configuration

---

## 🔌 Services API

### Architecture

Chaque module métier a son service API dédié :

```typescript
// Exemple: employeeService.ts
import api from './api';

export const employeeService = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  
  create: async (data: Employee) => {
    const response = await api.post('/employees', data);
    return response.data;
  },
  
  update: async (id: string, data: Employee) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/employees/${id}`);
  },
};
```

### Services disponibles

| Service | Endpoint | Description |
|---------|----------|-------------|
| `authService` | `/auth/*` | Authentification |
| `dashboardService` | `/dashboard/*` | Stats dashboard |
| `employeeService` | `/employees/*` | Employés |
| `departmentService` | `/departments/*` | Départements |
| `leaveService` | `/leaves/*` | Congés |
| `attendanceService` | `/attendance/*` | Présences |
| `invoiceService` | `/invoices/*` | Factures |
| `paymentService` | `/payments/*` | Paiements |
| `expenseService` | `/expenses/*` | Dépenses |
| `contactService` | `/contacts/*` | Contacts (CRM) |
| `dealService` | `/deals/*` | Deals (CRM) |
| `purchaseOrderService` | `/purchase-orders/*` | Achats |
| `stockService` | `/stock/*` | Stock |
| `projectService` | `/projects/*` | Projets |
| `documentService` | `/documents/*` | Documents |
| `studentService` | `/students/*` | Étudiants |
| `programService` | `/programs/*` | Programmes |
| `enrollmentService` | `/enrollments/*` | Inscriptions |
| `auditService` | `/audit-logs/*` | Audit logs |
| `settingsService` | `/settings/*` | Paramètres |

---

## 📐 Types

### Types principaux

Les types TypeScript sont définis dans `src/types/index.ts` :

- **User & Auth** : User, Permission, Role
- **Organization** : Department
- **Employees** : Employee, Contract, Leave
- **Finance** : Invoice, Payment, Expense
- **CRM** : Contact, Deal
- **Purchases** : PurchaseOrder
- **Inventory** : Asset, AssetAssignment
- **Projects** : Project, Task
- **Documents** : Document
- **Formation** : Student, Program, Enrollment
- **Dashboard** : KPI, ActivityLog

### Exemple

```typescript
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: Date;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  baseSalary: number;
  departmentId: string;
  positionTitle: string;
  // ...
}
```

---

## 🎨 State Management (Zustand)

### appStore

Gère l'état global de l'application :

```typescript
import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  activeNav: string;
  isSidebarOpen: boolean;
  // ...
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  activeNav: 'dashboard',
  isSidebarOpen: true,
  // actions...
}));
```

### toastStore

Gère les notifications :

```typescript
toast.success('Employé créé avec succès !');
toast.error('Une erreur est survenue');
toast.warning('Veuillez vérifier les champs');
```

---

## 🚢 Déploiement

### Docker

```bash
# Build l'image Docker
docker build -t tornadoes-job-erp-frontend .

# Lance le container
docker run -p 5173:80 tornadoes-job-erp-frontend
```

### Nginx (Production)

Le fichier `nginx.conf` est configuré pour :

- Servir les fichiers statiques
- Rediriger vers index.html pour le SPA routing
- Gérer le cache

---

## 📝 License

Copyright © 2024 Tornadoes Job. Tous droits réservés.

---

**Développé avec ❤️ par l'équipe Tornadoes Job**
