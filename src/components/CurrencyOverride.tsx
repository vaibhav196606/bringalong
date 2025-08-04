import { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getAllCurrencies, CurrencyInfo } from '../utils/currencyUtils';

interface CurrencyOverrideProps {
  className?: string;
}

export function CurrencyOverride({ className = '' }: CurrencyOverrideProps) {
  const { userCurrency, setUserCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allCurrencies = getAllCurrencies();
  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currency: CurrencyInfo) => {
    setUserCurrency(currency);
    setIsOpen(false);
    setSearchTerm('');
    
    // Clear the location cache to use the manual selection
    localStorage.setItem('manualCurrency', JSON.stringify(currency));
    
    console.log(`🔄 Manual currency override: ${currency.code} (${currency.name})`);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="text-sm font-medium">{userCurrency.symbol}</span>
        <span className="text-sm text-gray-600">{userCurrency.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between ${
                  currency.code === userCurrency.code ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-lg">{currency.symbol}</span>
                  <div>
                    <div className="font-medium text-sm">{currency.code}</div>
                    <div className="text-xs text-gray-500">{currency.name}</div>
                  </div>
                </div>
                {currency.code === userCurrency.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrencyOverride;
