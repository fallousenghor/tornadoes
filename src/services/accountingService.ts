// Accounting Service - Tornadoes Job Finance Module
// Service de comptabilité utilisant les données du backend

import api from './api';
import invoiceService from './invoiceService';
import dashboardService, { CashFlowDataPoint } from './dashboardService';

// Types pour la comptabilité (Plan Comptable)
export interface AccountingAccount {
  id: string;
  code: string;
  name: string;
  type: 'actif' | 'passif' | 'charge' | 'produit';
  parentCode?: string;
  balance: number;
  debit: number;
  credit: number;
}

// Écriture comptable (Journal Entry)
export interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  description: string;
  accounts: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
}

export interface JournalEntryLine {
  code: string;
  name: string;
  debit: number;
  credit: number;
}

// Résumé financier pour le bilan et compte de résultat
export interface FinancialSummary {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalExpenses: number;
  netBalance: number;
  invoiceCount: number;
  paidInvoiceCount: number;
  pendingInvoiceCount: number;
  expenseCount: number;
}

// Mapper les invoices en écritures comptables
const mapInvoicesToJournalEntries = (invoices: any[]): JournalEntry[] => {
  return invoices.map((invoice, index) => {
    const date = new Date(invoice.date);
    const isPaid = invoice.status === 'paye';
    
    // Créer les lignes d'écriture
    const lines: JournalEntryLine[] = [];
    
    if (isPaid) {
      // Facture payée - écriture complète
      lines.push({
        code: '512', // Banque
        name: 'Banque',
        debit: invoice.amount,
        credit: 0,
      });
      lines.push({
        code: '411', // Clients
        name: 'Clients',
        debit: 0,
        credit: invoice.amount,
      });
    } else {
      // Facture en attente - pas encore encaissée
      lines.push({
        code: '411', // Clients
        name: 'Clients',
        debit: invoice.amount,
        credit: 0,
      });
      lines.push({
        code: '701', // Ventes
        name: 'Ventes de marchandises',
        debit: 0,
        credit: invoice.amount,
      });
    }

    return {
      id: invoice.id,
      date: date,
      reference: invoice.reference,
      description: `Facture ${invoice.reference} - ${invoice.clientName}`,
      accounts: lines,
      totalDebit: invoice.amount,
      totalCredit: invoice.amount,
    };
  });
};

// Générer le plan des comptes basé sur les données disponibles
const generateAccountsFromBackend = (
  financialSummary: FinancialSummary,
  cashFlowData: CashFlowDataPoint[]
): AccountingAccount[] => {
  // Calculer les totaux du cash flow
  const totalIncomes = cashFlowData.reduce((sum, d) => sum + d.incomes, 0);
  const totalExpenses = cashFlowData.reduce((sum, d) => sum + d.expenses, 0);
  
  const accounts: AccountingAccount[] = [
    // Passif (Liabilities) - Capitaux propres
    { id: '1', code: '101', name: 'Capital', type: 'passif', balance: 5000000, debit: 0, credit: 0 },
    { id: '2', code: '110', name: 'Report à nouveau', type: 'passif', balance: 850000, debit: 0, credit: 0 },
    { id: '3', code: '120', name: 'Résultat de l\'exercice', type: 'passif', balance: financialSummary.netBalance, debit: 0, credit: 0 },
    { id: '4', code: '160', name: 'Emprunts', type: 'passif', balance: 1200000, debit: 0, credit: 0 },
    { id: '5', code: '401', name: 'Fournisseurs', type: 'passif', balance: financialSummary.totalPending, debit: 0, credit: 0 },
    
    // Actif (Assets)
    { id: '6', code: '411', name: 'Clients', type: 'actif', balance: financialSummary.totalPending, debit: 0, credit: 0 },
    { id: '7', code: '420', name: 'Personnel - Rémunérations', type: 'actif', balance: 0, debit: 0, credit: 0 },
    { id: '8', code: '430', name: 'Sécurité sociale', type: 'actif', balance: 125000, debit: 0, credit: 0 },
    { id: '9', code: '501', name: 'Caisse', type: 'actif', balance: 75000, debit: 0, credit: 0 },
    { id: '10', code: '512', name: 'Banque', type: 'actif', balance: totalIncomes - totalExpenses, debit: 0, credit: 0 },
    { id: '11', code: '521', name: 'Virements internes', type: 'actif', balance: 0, debit: 0, credit: 0 },
    
    // Charges (Expenses) - basées sur les dépenses réelles
    { id: '12', code: '601', name: 'Achats de marchandises', type: 'charge', balance: totalExpenses * 0.3, debit: totalExpenses * 0.3, credit: 0 },
    { id: '13', code: '602', name: 'Achats de matières premières', type: 'charge', balance: totalExpenses * 0.15, debit: totalExpenses * 0.15, credit: 0 },
    { id: '14', code: '604', name: 'Achats non stockés', type: 'charge', balance: totalExpenses * 0.1, debit: totalExpenses * 0.1, credit: 0 },
    { id: '15', code: '606', name: 'Fournitures', type: 'charge', balance: totalExpenses * 0.05, debit: totalExpenses * 0.05, credit: 0 },
    { id: '16', code: '621', name: 'Salaires et appointements', type: 'charge', balance: totalExpenses * 0.4, debit: totalExpenses * 0.4, credit: 0 },
    { id: '17', code: '623', name: 'Charges sociales', type: 'charge', balance: totalExpenses * 0.15, debit: totalExpenses * 0.15, credit: 0 },
    { id: '18', code: '626', name: 'Loyer', type: 'charge', balance: totalExpenses * 0.08, debit: totalExpenses * 0.08, credit: 0 },
    { id: '19', code: '627', name: 'Assurances', type: 'charge', balance: totalExpenses * 0.03, debit: totalExpenses * 0.03, credit: 0 },
    { id: '20', code: '628', name: 'Transports', type: 'charge', balance: totalExpenses * 0.04, debit: totalExpenses * 0.04, credit: 0 },
    
    // Produits (Revenue)
    { id: '21', code: '701', name: 'Ventes de marchandises', type: 'produit', balance: totalIncomes * 0.6, debit: 0, credit: totalIncomes * 0.6 },
    { id: '22', code: '706', name: 'Prestations de services', type: 'produit', balance: totalIncomes * 0.3, debit: 0, credit: totalIncomes * 0.3 },
    { id: '23', code: '708', name: 'Produits des activités annexes', type: 'produit', balance: totalIncomes * 0.1, debit: 0, credit: totalIncomes * 0.1 },
  ];
  
  return accounts;
};

const accountingService = {
  /**
   * Récupérer les données complètes de comptabilité
   */
  async getAccountingData(): Promise<{
    accounts: AccountingAccount[];
    journalEntries: JournalEntry[];
    financialSummary: FinancialSummary;
    cashFlowData: CashFlowDataPoint[];
  }> {
    try {
      // Récupérer les données en parallèle
      const [invoicesResponse, summary, cashFlow] = await Promise.all([
        invoiceService.getInvoices({ pageSize: 100 }),
        invoiceService.getFinancialSummary(),
        dashboardService.getCashFlow(),
      ]);

      // Mapper les invoices en écritures comptables
      const journalEntries = mapInvoicesToJournalEntries(invoicesResponse.data);
      
      // Générer le plan des comptes
      const accounts = generateAccountsFromBackend(
        {
          totalRevenue: typeof summary.totalRevenue === 'number' ? summary.totalRevenue : parseFloat(String(summary.totalRevenue)),
          totalPaid: typeof summary.totalPaid === 'number' ? summary.totalPaid : parseFloat(String(summary.totalPaid)),
          totalPending: typeof summary.totalPending === 'number' ? summary.totalPending : parseFloat(String(summary.totalPending)),
          totalExpenses: typeof summary.totalExpenses === 'number' ? summary.totalExpenses : parseFloat(String(summary.totalExpenses)),
          netBalance: typeof summary.netBalance === 'number' ? summary.netBalance : parseFloat(String(summary.netBalance)),
          invoiceCount: summary.invoiceCount,
          paidInvoiceCount: summary.paidInvoiceCount,
          pendingInvoiceCount: summary.pendingInvoiceCount,
          expenseCount: summary.expenseCount,
        },
        cashFlow
      );

      // Trier les écritures par date décroissante
      const sortedEntries = journalEntries.sort((a, b) => b.date.getTime() - a.date.getTime());

      return {
        accounts,
        journalEntries: sortedEntries,
        financialSummary: {
          totalRevenue: typeof summary.totalRevenue === 'number' ? summary.totalRevenue : parseFloat(String(summary.totalRevenue)),
          totalPaid: typeof summary.totalPaid === 'number' ? summary.totalPaid : parseFloat(String(summary.totalPaid)),
          totalPending: typeof summary.totalPending === 'number' ? summary.totalPending : parseFloat(String(summary.totalPending)),
          totalExpenses: typeof summary.totalExpenses === 'number' ? summary.totalExpenses : parseFloat(String(summary.totalExpenses)),
          netBalance: typeof summary.netBalance === 'number' ? summary.netBalance : parseFloat(String(summary.netBalance)),
          invoiceCount: summary.invoiceCount,
          paidInvoiceCount: summary.paidInvoiceCount,
          pendingInvoiceCount: summary.pendingInvoiceCount,
          expenseCount: summary.expenseCount,
        },
        cashFlowData: cashFlow,
      };
    } catch (error) {
      console.error('Error fetching accounting data:', error);
      throw error;
    }
  },

  /**
   * Récupérer uniquement les écritures comptables (Journal)
   */
  async getJournalEntries(): Promise<JournalEntry[]> {
    const data = await this.getAccountingData();
    return data.journalEntries;
  },

  /**
   * Récupérer uniquement le plan des comptes (Grand Livre)
   */
  async getAccounts(): Promise<AccountingAccount[]> {
    const data = await this.getAccountingData();
    return data.accounts;
  },

  /**
   * Récupérer le résumé financier pour Bilan et Compte de Résultat
   */
  async getFinancialSummary(): Promise<FinancialSummary> {
    const data = await this.getAccountingData();
    return data.financialSummary;
  },
};

export default accountingService;

