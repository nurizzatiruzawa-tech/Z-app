export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit (MYR)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
];

export const getCurrencySymbol = (code: string = 'USD'): string => {
  switch (code?.toUpperCase()) {
    case 'MYR':
      return 'RM';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'USD':
    default:
      return '$';
  }
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (symbol === 'RM') {
    return `RM ${formatted}`;
  }
  return `${symbol}${formatted}`;
};
