import { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { CurrencyInfo } from '../utils/currencyUtils';

interface NavbarCurrencySelectorProps {
  className?: string;
}

export function NavbarCurrencySelector({ className = '' }: NavbarCurrencySelectorProps) {
  const { userCurrency, setUserCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const popularCurrencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const handleCurrencySelect = (currency: CurrencyInfo) => {
    setUserCurrency(currency);
    setIsOpen(false);
    
    // Save the manual selection
    localStorage.setItem('manualCurrency', JSON.stringify(currency));
    
    console.log(`💱 Currency changed to: ${currency.code} (${currency.name})`);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="w-12 h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm font-medium text-gray-700"
        title={`Currency: ${userCurrency.name}`}
      >
        <span className="text-base">{userCurrency.symbol}</span>
        <span className="text-xs">{userCurrency.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
              Popular Currencies
            </div>
            {popularCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between ${
                  currency.code === userCurrency.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{currency.symbol}</span>
                  <span>{currency.code}</span>
                </div>
                {currency.code === userCurrency.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default NavbarCurrencySelector;
