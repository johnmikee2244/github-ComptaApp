import { JournalEntry } from '../../types/journal';
import { formatCurrency } from '../../utils/calculations';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onValidate: (entry: JournalEntry) => void;
}

export default function JournalEntryList({ entries, onValidate }: JournalEntryListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Référence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compte
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Libellé
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Débit
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Crédit
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.reference} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {entry.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.lines.map(line => line.accountCode).join(', ')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {entry.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(entry.metadata.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(entry.metadata.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                {entry.locked ? (
                  <Lock className="h-5 w-5 text-gray-400 mx-auto" />
                ) : entry.validated ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <button
                    onClick={() => onValidate(entry)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}