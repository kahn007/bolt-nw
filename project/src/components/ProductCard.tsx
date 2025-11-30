import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
  currency: string;
  delay?: number;
}

const SIZES = {
  'T-Shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Hoodies': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Womens Crop Tops': ['XS', 'S', 'M', 'L', 'XL'],
  'Caps': [],
  'Hats': [],
  'Beanies': []
};

export function ProductCard({ product, onAddToCart, currency, delay = 0 }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const sizes = SIZES[product.category as keyof typeof SIZES] || [];
  const requiresSize = sizes.length > 0;

  function getCurrencySymbol() {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  }

  function getConvertedPrice() {
    switch (currency) {
      case 'EUR': return product.price * 0.92;
      case 'GBP': return product.price * 0.79;
      default: return product.price;
    }
  }

  function handleAddToCart() {
    if (requiresSize && !selectedSize) {
      return;
    }
    onAddToCart(product, selectedSize || undefined);
    if (selectedSize) setSelectedSize('');
  }

  return (
    <div
      ref={ref}
      className={`group relative bg-[#1a1a1a] border border-white/5 overflow-hidden smooth-transition hover:border-white/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: isVisible ? `${delay}s` : '0s',
        transitionDuration: '0.8s',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className="aspect-square overflow-hidden bg-[#0a0a0a]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover smooth-transition group-hover:scale-105"
          style={{ transitionDuration: '0.8s' }}
        />
      </div>

      <div className="p-6 lg:p-8">
        <h3 className="text-base lg:text-lg font-light text-white tracking-wide mb-2">
          {product.name}
        </h3>
        <p className="text-white/40 text-xs lg:text-sm font-light tracking-wide mb-4">
          {product.description}
        </p>

        {requiresSize && (
          <div className="mb-4">
            <p className="text-white/40 text-xs font-light tracking-wider mb-2 uppercase">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-xs font-light tracking-wide smooth-transition ${
                    selectedSize === size
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg lg:text-xl font-light text-white tracking-tight">
            {getCurrencySymbol()}{getConvertedPrice().toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={requiresSize && !selectedSize}
            className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 text-xs lg:text-sm font-medium tracking-wide smooth-transition ${
              requiresSize && !selectedSize
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
