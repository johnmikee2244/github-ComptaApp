import { useState, useEffect } from 'react';
import { JournalType, JournalEntry, JournalFilters, JournalBalance } from '../../types/journal';
import JournalNavigation from './JournalNavigation';
import JournalFilters from './JournalFilters';
import JournalBalance from './JournalBalance';
import JournalEntryList from './JournalEntryList';
import { generateJournalReference } from '../../utils/journal';

interface JournalViewProps {
  initialEntries: JournalEntry[];
}

export default function JournalView({ initialEntries }: JournalViewProps) {
  const [activeJournal, setActiveJournal] = useState<JournalType>('sales');
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(entries);
  const [balance, setBalance] = useState<JournalBalance>({ debit: 0, credit: 0, balance: 0 });

  // Filtrer les écritures selon le journal actif et les filtres
  const applyFilters = (filters: JournalFilters) => {
    let filtered = entries.filter(entry => entry.journalType === activeJournal);

    if (filters.startDate) {
      filtered = filtered.filter(entry => entry.date >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(entry => entry.date <= filters.endDate!);
    }
    if (filters.reference) {
      filtered = filtered.filter(entry => 
        entry.reference.toLowerCase().includes(filters.reference!.toLowerCase())
      );
    }
    if (filters.validated !== undefined) {
      filtered = filtered.filter(entry => entry.validated === filters.validated);
    }

    setFilteredEntries(filtered);
    updateBalance(filtered);
  };

  // Mettre à jour le solde
  const updateBalance = (entries: JournalEntry[]) => {
    const newBalance = entries.reduce(
      (acc, entry) => {
        const entryDebit = entry.lines.reduce((sum, line) => sum + line.amount.debit, 0);
        const entryCredit = entry.lines.reduce((sum, line) => sum + line.amount.credit, 0);
        return {
          debit: acc.debit + entryDebit,
          credit: acc.credit + entryCredit,
          balance: acc.balance + (entryCredit - entryDebit)
        };
      },
      { debit: 0, credit: 0, balance: 0 }
    );
    setBalance(newBalance);
  };

  // Valider une écriture
  const handleValidateEntry = (entry: JournalEntry) => {
    const updatedEntries = entries.map(e =>
      e.reference === entry.reference ? { ...e, validated: true } : e
    );
    setEntries(updatedEntries);
  };

  // Exporter les données
  const handleExport = () => {
    const data = filteredEntries.map(entry => ({
      date: entry.date,
      reference: entry.reference,
      description: entry.description,
      debit: entry.lines.reduce((sum, line) => sum + line.amount.debit, 0),
      credit: entry.lines.reduce((sum, line) => sum + line.amount.credit, 0)
    }));

    const csv = [
      ['Date', 'Référence', 'Description', 'Débit', 'Crédit'].join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `journal_${activeJournal}_${new Date().toISOString()}.csv`;
    link.click();
  };

  // Mettre à jour les écritures filtrées quand le journal actif change
  useEffect(() => {
    applyFilters({});
  }, [activeJournal, entries]);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <JournalFilters onFilterChange={applyFilters} onExport={handleExport} />
        <JournalBalance balance={balance} />
        <JournalEntryList
          entries={filteredEntries}
          onValidate={handleValidateEntry}
        />
      </div>
      <JournalNavigation
        activeJournal={activeJournal}
        onJournalChange={setActiveJournal}
      />
    </div>
  );
}