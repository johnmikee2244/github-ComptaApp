import { JournalEntry } from '../../../types/journal';
import { formatCurrency } from '../../../utils/calculations';

interface BankJournalEntriesProps {
  entries: JournalEntry[];
  onValidate: (entry: JournalEntry) => void;
}

export default function BankJournalEntries({ entries, onValidate }: BankJournalEntriesProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Opération</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compte</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Débit</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Crédit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}