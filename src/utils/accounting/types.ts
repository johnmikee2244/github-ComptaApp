import { PaymentMethod } from '../../types';

export interface AccountingAmount {
  debit: number;
  credit: number;
}

export interface AccountingLine {
  accountCode: string;
  label: string;
  amount: AccountingAmount;
  reference?: string;
}

export interface AccountingEntry {
  date: string;
  reference: string;
  description: string;
  type: 'sale' | 'purchase';
  lines: AccountingLine[];
  metadata: {
    documentType: string;
    documentNumber: string;
    paymentMethod?: PaymentMethod;
    vatRate: number;
    priceBeforeTax: number;
    vatAmount: number;
    totalAmount: number;
  };
}

export interface AccountConfig {
  sales: {
    revenue: string;
    receivable: string;
    vatCollected: string;
  };
  purchases: {
    expense: string;
    payable: string;
    vatDeductible: string;
  };
  payment: {
    cash: string;
    bank: string;
    check: string;
  };
}