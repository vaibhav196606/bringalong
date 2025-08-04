import { useCurrency } from '../contexts/CurrencyContext';
import { useState, useEffect } from 'react';
import { getUserLocation } from '../utils/currencyUtils';
import CurrencyOverride from './CurrencyOverride';

interface CurrencyIndicatorProps {
  className?: string;
}

export function CurrencyIndicator({ className = '' }: CurrencyIndicatorProps) {
  const { userCurrency, isLoading } = useCurrency();
  const [userCountry, setUserCountry] = useState<string>('');
  const [showIndicator, setShowIndicator] = useState(true);
  const [isManualOverride, setIsManualOverride] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserCountry(location.country);
        
        // Check if this is a manual override
        const manualCurrency = localStorage.getItem('manualCurrency');
        setIsManualOverride(!!manualCurrency);
      } catch (error) {
        console.warn('Failed to get user location:', error);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    // Hide indicator after 15 seconds instead of 10
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!showIndicator || isLoading) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <span className="text-sm text-blue-800 font-medium">
              📍 {isManualOverride ? 'Manual Override' : `Detected: ${userCountry || 'Unknown'}`}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-blue-700">
                Currency: {userCurrency.code} ({userCurrency.symbol}) - {userCurrency.name}
              </span>
              <CurrencyOverride />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowIndicator(false)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-100"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-blue-600">
          All prices are automatically converted to your selected currency
        </p>
        {!isManualOverride && (
          <div className="flex space-x-3">
            <button
              onClick={() => {
                localStorage.removeItem('manualCurrency');
                // Clear the location cache too
                console.log('🔄 Clearing all currency cache and reloading...');
                window.location.reload();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Wrong location? Try again
            </button>
            <button
              onClick={() => {
                // Force India/INR for testing
                const inrCurrency = { code: 'INR', symbol: '₹', name: 'Indian Rupee' };
                localStorage.setItem('manualCurrency', JSON.stringify(inrCurrency));
                console.log('🇮🇳 Forcing India/INR currency');
                window.location.reload();
              }}
              className="text-xs text-green-600 hover:text-green-800 underline font-medium"
            >
              🇮🇳 Set to India (INR)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrencyIndicator;
