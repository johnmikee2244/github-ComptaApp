import { JournalEntry } from '../../types/journal';

export const formatJournalReference = (prefix: string, number: number): string => {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(number).padStart(5, '0')}`;
};

export const formatAccountingAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatJournalExport = (entries: JournalEntry[]): string => {
  const headers = ['Date', 'Référence', 'Compte', 'Libellé', 'Débit', 'Crédit'];
  const rows = entries.flatMap(entry => 
    entry.lines.map(line => [
      new Date(entry.date).toLocaleDateString(),
      entry.reference,
      line.accountCode,
      line.label,
      line.amount.debit.toFixed(2),
      line.amount.credit.toFixed(2)
    ])
  );

  return [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');
};