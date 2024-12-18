import { JournalEntry, JournalType } from '../../types/journal';

export const validateJournalEntry = (entry: JournalEntry, journalType: JournalType): boolean => {
  // Vérification de l'équilibre débit/crédit
  const totalDebit = entry.lines.reduce((sum, line) => sum + line.amount.debit, 0);
  const totalCredit = entry.lines.reduce((sum, line) => sum + line.amount.credit, 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return false;
  }

  // Vérification de la correspondance du type de journal
  switch (journalType) {
    case 'sales':
      return entry.lines.some(line => line.accountCode.startsWith('7'));
    case 'purchases':
      return entry.lines.some(line => line.accountCode.startsWith('6'));
    case 'bank':
      return entry.lines.some(line => line.accountCode.startsWith('512'));
    case 'cash':
      return entry.lines.some(line => line.accountCode.startsWith('531'));
    case 'misc':
      return true; // Les OD peuvent utiliser n'importe quel compte
    default:
      return false;
  }
};

export const validateAccountingPeriod = (entry: JournalEntry, startDate: string, endDate: string): boolean => {
  const entryDate = new Date(entry.date);
  return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
};