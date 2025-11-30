import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Product } from '../lib/supabase';
import { formatPrice } from '../lib/currency';

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemove: (productId: string, size?: string) => void;
  currency: string;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, currency, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 smooth-transition ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#060606] border-l border-white/[0.08] z-50 animate-slide-in ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h2 className="text-xl font-light text-white tracking-[0.1em]">CART</h2>
            <button
              onClick={onClose}
              className="p-2 hover:opacity-70 smooth-transition"
            >
              <X className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-light">Your cart is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-white/10 pb-4 hover:opacity-80 smooth-transition"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-32 overflow-hidden bg-zinc-900 flex-shrink-0">
                      <img
                        src={(item as any).image || (item as any).image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-light mb-2 tracking-tight">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-white/30 text-xs mb-1 font-light">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-white/50 text-sm mb-4 font-light">
                        {formatPrice(item.price, currency)}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.size)}
                          className="p-1 hover:opacity-70 smooth-transition"
                        >
                          <Minus className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                        </button>
                        <span className="text-white font-light w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.size)}
                          className="p-1 hover:opacity-70 smooth-transition"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => onRemove(item.id, item.size)}
                          className="ml-auto text-white/40 hover:text-white/70 smooth-transition"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-white/10 p-8 bg-black">
              <div className="flex justify-between items-center text-white mb-8">
                <span className="text-sm font-light text-white/50 tracking-wide">TOTAL</span>
                <span className="text-3xl font-light tracking-tight">
                  {formatPrice(total, currency)}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-white text-black py-4 font-medium tracking-wide hover:bg-white/90 smooth-transition text-sm"
              >
                CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
