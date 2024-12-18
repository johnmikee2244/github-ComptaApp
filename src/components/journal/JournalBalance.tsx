import { JournalBalance as Balance } from '../../types/journal';
import { formatCurrency } from '../../utils/calculations';

interface JournalBalanceProps {
  balance: Balance;
}

export default function JournalBalance({ balance }: JournalBalanceProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="text-sm font-medium text-gray-500">Total Débit</span>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatCurrency(balance.debit)}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Total Crédit</span>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatCurrency(balance.credit)}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Solde</span>
          <p className={`mt-1 text-2xl font-semibold ${
            balance.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(balance.balance))}
            <span className="text-sm font-normal ml-1">
              {balance.balance >= 0 ? 'Créditeur' : 'Débiteur'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}