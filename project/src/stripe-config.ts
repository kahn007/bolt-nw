export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  image?: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1SXPHHLzJJ40c4lgPtC6ZP3K',
    name: 'NHH SIGNATURE CROP TOP',
    description: 'Premium signature crop top with NHH branding',
    mode: 'payment',
    price: 65.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPH2LzJJ40c4lgynk0qwyX',
    name: 'TWITTER STATEMENT BEANIE',
    description: 'Stylish beanie with Twitter statement design',
    mode: 'payment',
    price: 40.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPGcLzJJ40c4lgKM0RmxB7',
    name: 'NHH SIGNATURE HAT - WHITE',
    description: 'Classic white signature hat with NHH logo',
    mode: 'payment',
    price: 45.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPG8LzJJ40c4lg0jiV3BgA',
    name: 'NHH SIGNATURE CAP - WHITE',
    description: 'Premium white cap with signature NHH design',
    mode: 'payment',
    price: 45.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPFyLzJJ40c4lgiObeRpKA',
    name: 'NHH SIGNATURE CAP - BLACK',
    description: 'Premium black cap with signature NHH design',
    mode: 'payment',
    price: 45.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPFSLzJJ40c4lgqoB2h52m',
    name: 'TWITTER STATEMENT HOODIE (Black)',
    description: 'Premium black hoodie with Twitter statement design',
    mode: 'payment',
    price: 145.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    priceId: 'price_1SXPEzLzJJ40c4lgdkFTrBlK',
    name: 'NHH SIGNATURE HOODIE (White)',
    description: 'Premium white hoodie with signature NHH design',
    mode: 'payment',
    price: 145.00,
    currency: 'USD',
    image: 'https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}