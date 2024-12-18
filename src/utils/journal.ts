import { Transaction, JournalEntry, JournalType } from '../types';
import { JOURNAL_CONFIGS } from '../types/journal';
import { generateAccountingEntry, validateAccountingEntry } from './accounting/generator';

export const generateJournalReference = (
  journalType: JournalType,
  existingEntries: JournalEntry[]
): string => {
  const prefix = JOURNAL_CONFIGS[journalType].prefix;
  const currentYear = new Date().getFullYear();
  const existingRefs = existingEntries
    .filter(e => e.reference.startsWith(`${prefix}-${currentYear}`))
    .map(e => parseInt(e.reference.split('-')[2]));

  const nextNumber = existingRefs.length > 0
    ? Math.max(...existingRefs) + 1
    : 1;

  return `${prefix}-${currentYear}-${String(nextNumber).padStart(5, '0')}`;
};

export const determineJournalType = (transaction: Transaction): JournalType => {
  switch (transaction.paymentMethod) {
    case 'cash':
      return 'cash';
    case 'bank_transfer':
    case 'credit_card':
      return 'bank';
    default:
      return transaction.type === 'sale' ? 'sales' : 'purchases';
  }
};

export const createJournalEntries = (transaction: Transaction): JournalEntry[] => {
  const accountingEntry = generateAccountingEntry(transaction);
  
  if (!validateAccountingEntry(accountingEntry)) {
    throw new Error(`Erreur de génération de l'écriture comptable pour la transaction ${transaction.reference}`);
  }

  const journalType = determineJournalType(transaction);
  const reference = generateJournalReference(journalType, []);

  return [{
    id: `${transaction.id}-journal`,
    journalType,
    reference,
    date: accountingEntry.date,
    description: accountingEntry.description,
    lines: accountingEntry.lines,
    validated: false,
    locked: false,
    metadata: {
      documentType: accountingEntry.metadata.documentType,
      documentNumber: accountingEntry.metadata.documentNumber,
      totalAmount: accountingEntry.metadata.totalAmount
    }
  }];
};