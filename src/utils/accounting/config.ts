import { AccountConfig } from './types';

export const accountingConfig: AccountConfig = {
  sales: {
    revenue: '707', // Ventes de marchandises
    receivable: '411', // Clients
    vatCollected: '445711', // TVA collectée
  },
  purchases: {
    expense: '607', // Achats de marchandises
    payable: '401', // Fournisseurs
    vatDeductible: '445662', // TVA déductible
  },
  payment: {
    cash: '531', // Caisse
    bank: '512', // Banque
    check: '511', // Valeurs à l'encaissement
  },
};

export const getPaymentAccount = (paymentMethod: string): string => {
  switch (paymentMethod) {
    case 'cash':
      return accountingConfig.payment.cash;
    case 'bank_transfer':
    case 'credit_card':
      return accountingConfig.payment.bank;
    case 'check':
      return accountingConfig.payment.check;
    default:
      return accountingConfig.payment.bank;
  }
};