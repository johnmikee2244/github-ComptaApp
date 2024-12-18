import { useState } from 'react';
import JournalNavigation from './journal/JournalNavigation';
import JournalFilters from './journal/JournalFilters';
import JournalBalance from './journal/JournalBalance';
import JournalEntryList from './journal/JournalEntryList';
import { useJournalFilters } from './journal/hooks/useJournalFilters';
import { JournalType, JournalEntry } from '../types/journal';
import { toast } from 'react-toastify';

interface JournalListProps {
  entries: JournalEntry[];
}

export default function JournalList({ entries: initialEntries }: JournalListProps) {
  const [activeJournal, setActiveJournal] = useState<JournalType>('sales');
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const { filteredEntries, applyFilters } = useJournalFilters(entries);
  const [balance, setBalance] = useState({ debit: 0, credit: 0, balance: 0 });

  const handleJournalChange = (journal: JournalType) => {
    setActiveJournal(journal);
    applyFilters({}, journal);
    updateBalance(filteredEntries);
  };

  const updateBalance = (currentEntries: JournalEntry[]) => {
    const newBalance = currentEntries.reduce(
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

  const handleValidateEntry = (entry: JournalEntry) => {
    const totalDebit = entry.lines.reduce((sum, line) => sum + line.amount.debit, 0);
    const totalCredit = entry.lines.reduce((sum, line) => sum + line.amount.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      toast.error("L'écriture n'est pas équilibrée");
      return;
    }

    const updatedEntries = entries.map(e =>
      e.reference === entry.reference ? { ...e, validated: true } : e
    );
    setEntries(updatedEntries);
    toast.success("L'écriture a été validée avec succès");
  };

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
    toast.success('Export réalisé avec succès');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <JournalFilters 
          onFilterChange={(filters) => {
            applyFilters(filters, activeJournal);
            updateBalance(filteredEntries);
          }} 
          onExport={handleExport}
        />
        <JournalBalance balance={balance} />
        <JournalEntryList
          entries={filteredEntries}
          onValidate={handleValidateEntry}
        />
      </div>
      <JournalNavigation
        activeJournal={activeJournal}
        onJournalChange={handleJournalChange}
      />
    </div>
  );
}