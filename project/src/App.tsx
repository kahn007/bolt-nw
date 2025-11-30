import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { Cart, CartItem } from './components/Cart';
import { CurrencySelector } from './components/CurrencySelector';
import { CheckoutSection } from './components/CheckoutSection';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  size?: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NHH SIGNATURE TEE',
    price: 55,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'Premium minimalist design',
    category: 'T-Shirts'
  },
  {
    id: '2',
    name: 'TWITTER STATEMENT TEE',
    price: 55,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'They don\'t understand the things I say on Twitter',
    category: 'T-Shirts'
  },
  {
    id: '11',
    name: 'NHH SIGNATURE HOODIE',
    price: 145,
    image: '/image copy.png',
    description: 'They don\'t understand the things I say on Twitter',
    category: 'Hoodies'
  },
  {
    id: '19',
    name: 'TWITTER STATEMENT HOODIE',
    price: 145,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'They don\'t understand the things I say on Twitter',
    category: 'Hoodies'
  },
  {
    id: '20',
    name: 'NHH SPECIAL EDITION CAP - LIMITED TIME ONLY',
    price: 55,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'Exclusive limited edition design',
    category: 'Caps'
  },
  {
    id: '13',
    name: 'NHH SIGNATURE CAP - BLACK',
    price: 45,
    image: '/image copy copy copy copy copy copy.png',
    description: 'Bold statement piece',
    category: 'Caps'
  },
  {
    id: '14',
    name: 'NHH SIGNATURE CAP - WHITE',
    price: 45,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'Clean minimalist style',
    category: 'Caps'
  },
  {
    id: '15',
    name: 'NHH SIGNATURE BEANIE - BLACK',
    price: 40,
    image: '/image copy copy copy copy.png',
    description: 'They don\'t understand the things I say on Twitter',
    category: 'Beanies'
  },
  {
    id: '16',
    name: 'NHH SIGNATURE BEANIE - WHITE',
    price: 40,
    image: '/image.png',
    description: 'Premium winter essential',
    category: 'Beanies'
  },
  {
    id: '17',
    name: 'NHH SIGNATURE HAT - WHITE',
    price: 45,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'Bold statement piece',
    category: 'Hats'
  },
  {
    id: '18',
    name: 'TWITTER STATEMENT BEANIE',
    price: 40,
    image: '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png',
    description: 'They don\'t understand the things I say on Twitter',
    category: 'Hats'
  },
  {
    id: '12',
    name: 'NHH SIGNATURE CROP TOP',
    price: 65,
    image: '/image copy copy.png',
    description: 'Bold logo statement piece',
    category: 'Womens Crop Tops'
  }
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Caps', 'Hats', 'Womens Crop Tops'];

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');

  function addToCart(product: Product, size?: string) {
    setCartItems((prev) => {
      const itemKey = size ? `${product.id}-${size}` : product.id;
      const existing = prev.find((item) => {
        const existingKey = item.size ? `${item.id}-${item.size}` : item.id;
        return existingKey === itemKey;
      });
      if (existing) {
        return prev.map((item) => {
          const existingKey = item.size ? `${item.id}-${item.size}` : item.id;
          return existingKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item;
        });
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function updateQuantity(productId: string, quantity: number, size?: string) {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCartItems((prev) =>
        prev.map((item) => {
          const itemKey = item.size ? `${item.id}-${item.size}` : item.id;
          const targetKey = size ? `${productId}-${size}` : productId;
          return itemKey === targetKey ? { ...item, quantity } : item;
        })
      );
    }
  }

  function removeFromCart(productId: string, size?: string) {
    setCartItems((prev) => {
      const targetKey = size ? `${productId}-${size}` : productId;
      return prev.filter((item) => {
        const itemKey = item.size ? `${item.id}-${item.size}` : item.id;
        return itemKey !== targetKey;
      });
    });
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleCheckout() {
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 400);
  }

  function handleOrderComplete() {
    setCartItems([]);
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#141414]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl lg:text-2xl font-light text-white" style={{ letterSpacing: '0.15em' }}>
              NHH
            </h1>
            <div className="flex items-center gap-2">
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
              />
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:opacity-70 smooth-transition"
              >
                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
          <div className="absolute inset-0 bg-[#141414]" />
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h2 className="text-7xl lg:text-9xl font-light tracking-tight text-white mb-8 animate-fade-in-up" style={{ letterSpacing: '-0.02em' }}>
              NHH
            </h2>
            <p
              className="text-base lg:text-lg text-white/50 font-light tracking-wider animate-fade-in-up uppercase"
              style={{ animationDelay: '0.2s', letterSpacing: '0.2em' }}
            >
              Future Fashion
            </p>
          </div>
        </section>

        {CATEGORIES.map((category, categoryIndex) => {
          const categoryProducts = PRODUCTS.filter(p => p.category === category);
          return (
            <section key={category} className="py-16 lg:py-24">
              <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
                <div className="mb-12 lg:mb-16">
                  <h3 className="text-3xl lg:text-4xl font-light text-white tracking-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
                    {category}
                  </h3>
                  <div className="w-12 h-px bg-white/20" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {categoryProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      currency={currency}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <footer className="py-16 border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-white/30 text-xs font-light tracking-wider">
                For any support enquiries - hello@nhhshop.com
              </p>
              <p className="text-white/30 text-xs font-light tracking-wider uppercase" style={{ letterSpacing: '0.15em' }}>
                © 2025 NHH. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        currency={currency}
        onCheckout={handleCheckout}
      />

      <CheckoutSection
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotal}
        currency={currency}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}

export default App;
