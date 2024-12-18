import { JournalEntry } from '../../../types/journal';
import { formatCurrency } from '../../../utils/calculations';

interface CashJournalEntriesProps {
  entries: JournalEntry[];
  onValidate: (entry: JournalEntry) => void;
}

export default function CashJournalEntries({ entries, onValidate }: CashJournalEntriesProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Pièce</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Entrée</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sortie</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry, index) => {
            const previousBalance = entries
              .slice(0, index)
              .reduce((sum, e) => sum + e.lines.reduce((s, l) => s + l.amount.debit - l.amount.credit, 0), 0);
            const currentBalance = previousBalance + entry.lines.reduce((sum, line) => sum + line.amount.debit - line.amount.credit, 0);
            
            return (
              <tr key={entry.reference} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.reference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.metadata.documentType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.lines.map(line => line.accountCode).join(', ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(entry.lines.reduce((sum, line) => sum + line.amount.debit, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(entry.lines.reduce((sum, line) => sum + line.amount.credit, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(currentBalance)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}