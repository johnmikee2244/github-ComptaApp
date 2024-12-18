export type JournalType = 'sales' | 'purchases' | 'bank' | 'cash' | 'misc';

export interface JournalConfig {
  id: JournalType;
  label: string;
  prefix: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  journalType: JournalType;
  reference: string;
  date: string;
  description: string;
  lines: JournalLine[];
  validated: boolean;
  locked: boolean;
  metadata: {
    documentType: string;
    documentNumber: string;
    totalAmount: number;
  };
}

export interface JournalLine {
  accountCode: string;
  label: string;
  amount: {
    debit: number;
    credit: number;
  };
  reference?: string;
}

export interface JournalBalance {
  debit: number;
  credit: number;
  balance: number;
}

export interface JournalFilters {
  startDate?: string;
  endDate?: string;
  reference?: string;
  validated?: boolean;
}

export const JOURNAL_CONFIGS: Record<JournalType, JournalConfig> = {
  sales: {
    id: 'sales',
    label: 'Journal des Ventes',
    prefix: 'VE',
    description: 'Factures clients et avoirs'
  },
  purchases: {
    id: 'purchases',
    label: 'Journal des Achats',
    prefix: 'AC',
    description: 'Factures fournisseurs'
  },
  bank: {
    id: 'bank',
    label: 'Journal de Banque',
    prefix: 'BQ',
    description: 'Opérations bancaires'
  },
  cash: {
    id: 'cash',
    label: 'Journal de Caisse',
    prefix: 'CA',
    description: 'Mouvements espèces'
  },
  misc: {
    id: 'misc',
    label: 'Opérations Diverses',
    prefix: 'OD',
    description: 'Écritures d\'ajustement'
  }
};