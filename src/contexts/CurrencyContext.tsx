import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getUserLocation, 
  convertCurrency, 
  formatCurrency, 
  getCurrencyInfo, 
  getAllCurrencies,
  CurrencyInfo,
  DEFAULT_CURRENCY 
} from '../utils/currencyUtils';

interface CurrencyContextType {
  userCurrency: CurrencyInfo;
  isLoading: boolean;
  convertAndFormat: (amount: number, fromCurrency: string) => Promise<string>;
  convertAmount: (amount: number, fromCurrency: string) => Promise<number>;
  allCurrencies: CurrencyInfo[];
  setUserCurrency: (currency: CurrencyInfo) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [userCurrency, setUserCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);
  const [allCurrencies] = useState<CurrencyInfo[]>(getAllCurrencies());

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        setIsLoading(true);
        
        // Check for manual currency override first
        const manualCurrency = localStorage.getItem('manualCurrency');
        if (manualCurrency) {
          try {
            const parsedCurrency = JSON.parse(manualCurrency);
            console.log('🔧 Using manual currency override:', parsedCurrency);
            setUserCurrency(parsedCurrency);
            return;
          } catch (error) {
            console.warn('Failed to parse manual currency, removing:', error);
            localStorage.removeItem('manualCurrency');
          }
        }
        
        // Detect location and currency
        console.log('🌍 Starting location detection...');
        const location = await getUserLocation();
        console.log('✅ Location detection complete:', location);
        console.log('🔄 Setting currency context to:', location.currency);
        setUserCurrency(location.currency);
        console.log('💰 Currency context updated successfully');
      } catch (error) {
        console.warn('❌ Failed to detect user location, using default currency:', error);
        setUserCurrency(DEFAULT_CURRENCY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  const convertAndFormat = async (amount: number, fromCurrency: string): Promise<string> => {
    try {
      const convertedAmount = await convertCurrency(amount, fromCurrency, userCurrency.code);
      return formatCurrency(convertedAmount, userCurrency);
    } catch (error) {
      console.warn('Currency conversion failed, showing original amount:', error);
      const originalCurrencyInfo = getCurrencyInfo(fromCurrency);
      return formatCurrency(amount, originalCurrencyInfo);
    }
  };

  const convertAmount = async (amount: number, fromCurrency: string): Promise<number> => {
    try {
      return await convertCurrency(amount, fromCurrency, userCurrency.code);
    } catch (error) {
      console.warn('Currency conversion failed, returning original amount:', error);
      return amount;
    }
  };

  const value: CurrencyContextType = {
    userCurrency,
    isLoading,
    convertAndFormat,
    convertAmount,
    allCurrencies,
    setUserCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export default CurrencyProvider;
