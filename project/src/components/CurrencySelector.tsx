import { useState, useRef, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:opacity-70 smooth-transition flex items-center gap-1"
      >
        <DollarSign className="w-5 h-5 text-white" strokeWidth={1.5} />
        <span className="text-sm text-white font-light">{currentCurrency?.code}</span>
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-lg overflow-hidden z-50 transition-all duration-300 origin-top-right ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {currencies.map((currency, index) => (
          <button
            key={currency.code}
            onClick={() => {
              onCurrencyChange(currency.code);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left hover:bg-white/5 smooth-transition flex items-center justify-between ${
              currency.code === selectedCurrency ? 'bg-white/5' : ''
            } ${isOpen ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: isOpen ? `${index * 0.05}s` : '0s' }}
          >
            <div>
              <div className="text-white text-sm font-light">{currency.code}</div>
              <div className="text-white/50 text-xs font-light">{currency.name}</div>
            </div>
            <span className="text-white/70">{currency.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
