const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.35,
  AUD: 1.52,
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

export function convertPrice(priceInUSD: number | string, targetCurrency: string): number {
  const numericPrice = typeof priceInUSD === 'string' ? parseFloat(priceInUSD) : priceInUSD;
  const rate = exchangeRates[targetCurrency] || 1;
  return numericPrice * rate;
}

export function formatPrice(price: number | string, currency: string): string {
  const symbol = currencySymbols[currency] || '$';
  const convertedPrice = convertPrice(price, currency);

  if (currency === 'JPY') {
    return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
  }

  return `${symbol}${convertedPrice.toFixed(2)}`;
}
