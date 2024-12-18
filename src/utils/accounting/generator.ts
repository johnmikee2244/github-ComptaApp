import { Transaction } from '../../types';
import { AccountingEntry, AccountingLine, AccountingAmount } from './types';
import { accountingConfig, getPaymentAccount } from './config';
import { formatCurrency } from '../calculations';

const createAmount = (debit: number = 0, credit: number = 0): AccountingAmount => ({
  debit: Number(debit.toFixed(2)),
  credit: Number(credit.toFixed(2))
});

const createAccountingLine = (
  accountCode: string,
  label: string,
  amount: AccountingAmount,
  reference?: string
): AccountingLine => ({
  accountCode,
  label,
  amount,
  reference
});

export const generateAccountingEntry = (transaction: Transaction): AccountingEntry => {
  const lines: AccountingLine[] = [];
  const isSale = transaction.type === 'sale';
  const config = isSale ? accountingConfig.sales : accountingConfig.purchases;

  // 1. Création de l'en-tête de l'écriture
  const entry: AccountingEntry = {
    date: transaction.date,
    reference: transaction.reference,
    description: `${isSale ? 'Vente' : 'Achat'} ${transaction.reference}`,
    type: transaction.type,
    lines: [],
    metadata: {
      documentType: isSale ? 'FACTURE' : 'FACTURE_FOURNISSEUR',
      documentNumber: transaction.reference,
      paymentMethod: transaction.paymentMethod,
      vatRate: transaction.vatAmount / transaction.priceBeforeTax,
      priceBeforeTax: transaction.priceBeforeTax,
      vatAmount: transaction.vatAmount,
      totalAmount: transaction.totalPrice
    }
  };

  // 2. Génération des lignes d'écritures selon le type de transaction
  if (isSale) {
    // Client débit du montant TTC
    lines.push(createAccountingLine(
      config.receivable,
      'Créance client',
      createAmount(transaction.totalPrice, 0),
      transaction.reference
    ));

    // TVA collectée crédit du montant de la TVA
    lines.push(createAccountingLine(
      config.vatCollected,
      'TVA collectée',
      createAmount(0, transaction.vatAmount),
      transaction.reference
    ));

    // Ventes crédit du montant HT
    lines.push(createAccountingLine(
      config.revenue,
      'Vente de marchandises',
      createAmount(0, transaction.priceBeforeTax),
      transaction.reference
    ));

    // Si paiement immédiat
    if (transaction.paymentMethod && transaction.status === 'confirmed') {
      const paymentAccount = getPaymentAccount(transaction.paymentMethod);
      
      // Compte de trésorerie débit du montant TTC
      lines.push(createAccountingLine(
        paymentAccount,
        `Règlement ${transaction.paymentMethod}`,
        createAmount(transaction.totalPrice, 0),
        transaction.reference
      ));

      // Client crédit du montant TTC (contre-passation)
      lines.push(createAccountingLine(
        config.receivable,
        'Règlement client',
        createAmount(0, transaction.totalPrice),
        transaction.reference
      ));
    }
  } else {
    // Achat débit du montant HT
    lines.push(createAccountingLine(
      config.expense,
      'Achat de marchandises',
      createAmount(transaction.priceBeforeTax, 0),
      transaction.reference
    ));

    // TVA déductible débit du montant de la TVA
    lines.push(createAccountingLine(
      config.vatDeductible,
      'TVA déductible',
      createAmount(transaction.vatAmount, 0),
      transaction.reference
    ));

    // Fournisseur crédit du montant TTC
    lines.push(createAccountingLine(
      config.payable,
      'Dette fournisseur',
      createAmount(0, transaction.totalPrice),
      transaction.reference
    ));

    // Si paiement immédiat
    if (transaction.paymentMethod && transaction.status === 'confirmed') {
      const paymentAccount = getPaymentAccount(transaction.paymentMethod);

      // Fournisseur débit du montant TTC
      lines.push(createAccountingLine(
        config.payable,
        'Règlement fournisseur',
        createAmount(transaction.totalPrice, 0),
        transaction.reference
      ));

      // Compte de trésorerie crédit du montant TTC
      lines.push(createAccountingLine(
        paymentAccount,
        `Règlement ${transaction.paymentMethod}`,
        createAmount(0, transaction.totalPrice),
        transaction.reference
      ));
    }
  }

  entry.lines = lines;
  return entry;
};

export const validateAccountingEntry = (entry: AccountingEntry): boolean => {
  const totals = entry.lines.reduce(
    (acc, line) => ({
      debit: acc.debit + line.amount.debit,
      credit: acc.credit + line.amount.credit
    }),
    { debit: 0, credit: 0 }
  );

  // Vérification de l'équilibre débit/crédit
  if (Math.abs(totals.debit - totals.credit) > 0.01) {
    console.error(
      `Écriture déséquilibrée: Débit=${formatCurrency(totals.debit)}, Crédit=${formatCurrency(totals.credit)}`
    );
    return false;
  }

  // Vérification des montants
  const { priceBeforeTax, vatAmount, totalAmount } = entry.metadata;
  if (Math.abs((priceBeforeTax + vatAmount) - totalAmount) > 0.01) {
    console.error('Incohérence dans les montants de la transaction');
    return false;
  }

  return true;
};