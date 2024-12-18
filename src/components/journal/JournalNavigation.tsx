import { Receipt, ShoppingCart, Wallet, Coins, FileText } from 'lucide-react';
import { JournalType } from '../../types/journal';

const journalTabs = [
  { id: 'sales' as JournalType, label: 'Ventes', Icon: Receipt },
  { id: 'purchases' as JournalType, label: 'Achats', Icon: ShoppingCart },
  { id: 'bank' as JournalType, label: 'Banque', Icon: Wallet },
  { id: 'cash' as JournalType, label: 'Caisse', Icon: Coins },
  { id: 'misc' as JournalType, label: 'Opérations Diverses', Icon: FileText },
];

interface JournalNavigationProps {
  activeJournal: JournalType;
  onJournalChange: (journal: JournalType) => void;
}

export default function JournalNavigation({ activeJournal, onJournalChange }: JournalNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between">
        {journalTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onJournalChange(id)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
              activeJournal === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}