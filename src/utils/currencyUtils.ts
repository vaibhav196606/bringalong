// Currency utilities for location-based currency detection and conversion

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyInfo> = {
  'IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'US': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'EU': { code: 'EUR', symbol: '€', name: 'Euro' },
  'DE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'FR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'IT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'ES': { code: 'EUR', symbol: '€', name: 'Euro' },
  'CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'BR': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'MX': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  'RU': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  'KR': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'SG': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  'AE': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'SA': { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  'ZA': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'CH': { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  'SE': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  'NO': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  'DK': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  'PL': { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  'TR': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'TH': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'MY': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  'ID': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'PH': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  'VN': { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  'BD': { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  'PK': { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  'LK': { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
  'NP': { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
  'EG': { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  'NG': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'KE': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'GH': { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  'AR': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  'CL': { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  'CO': { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  'PE': { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  'UY': { code: 'UYU', symbol: '$', name: 'Uruguayan Peso' },
  'IL': { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  'NZ': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  'HK': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  'TW': { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' }
};

// Default fallback currency
export const DEFAULT_CURRENCY: CurrencyInfo = { code: 'INR', symbol: '₹', name: 'Indian Rupee' };

// Cache for user location and currency
let userLocationCache: {
  country?: string;
  currency?: CurrencyInfo;
  timestamp?: number;
} = {};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Function to clear location cache
export function clearLocationCache(): void {
  userLocationCache = {};
  console.log('🧹 Location cache cleared');
}

// Get user's location using IP geolocation
export async function getUserLocation(): Promise<{ country: string; currency: CurrencyInfo }> {
  // Check cache first
  const now = Date.now();
  if (userLocationCache.country && userLocationCache.timestamp && 
      (now - userLocationCache.timestamp) < CACHE_DURATION) {
    return {
      country: userLocationCache.country,
      currency: userLocationCache.currency || DEFAULT_CURRENCY
    };
  }

  try {
    // Try multiple free IP geolocation services for reliability
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://freegeoip.app/json/',
      'https://ipinfo.io/json'  // Added ipinfo.io for better accuracy
    ];

    for (const service of services) {
      try {
        console.log(`🔍 Trying geolocation service: ${service}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country_code || data.countryCode || data.country;
          
          console.log(`🌍 Geolocation API ${service} response:`, {
            service,
            countryCode,
            detectedCountry: data.country_name || data.country,
            city: data.city,
            region: data.region,
            ip: data.ip,
            fullResponse: data
          });
          
          if (countryCode) {
            const currency = COUNTRY_CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
            
            console.log(`✅ Location detected: ${countryCode} → Currency: ${currency.code}`, {
              country: countryCode,
              currency: currency,
              source: service
            });
            
            // Cache the result
            userLocationCache = {
              country: countryCode,
              currency,
              timestamp: now
            };
            
            return { country: countryCode, currency };
          }
        } else {
          console.warn(`❌ HTTP error from ${service}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`❌ Failed to get location from ${service}:`, error instanceof Error ? error.message : error);
        continue; // Try next service
      }
    }
    
    throw new Error('All geolocation services failed');
  } catch (error) {
    console.warn('Failed to detect user location, using default currency:', error);
    const result = { country: 'IN', currency: DEFAULT_CURRENCY };
    
    // Cache the fallback
    userLocationCache = {
      country: 'IN',
      currency: DEFAULT_CURRENCY,
      timestamp: now
    };
    
    return result;
  }
}

// Exchange rate cache
let exchangeRateCache: {
  [key: string]: {
    rate: number;
    timestamp: number;
  }
} = {};

const EXCHANGE_RATE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Get exchange rate from one currency to another
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return 1;

  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const now = Date.now();
  
  // Check cache first
  if (exchangeRateCache[cacheKey] && 
      (now - exchangeRateCache[cacheKey].timestamp) < EXCHANGE_RATE_CACHE_DURATION) {
    return exchangeRateCache[cacheKey].rate;
  }

  try {
    // Try multiple free currency exchange APIs
    const apis = [
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
      `https://api.fixer.io/latest?base=${fromCurrency}&access_key=YOUR_API_KEY`, // Would need API key
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    ];

    for (const apiUrl of apis) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(apiUrl, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const rate = data.rates?.[toCurrency];
          
          if (rate && typeof rate === 'number') {
            // Cache the result
            exchangeRateCache[cacheKey] = {
              rate,
              timestamp: now
            };
            
            return rate;
          }
        }
      } catch (error) {
        console.warn(`Failed to get exchange rate from ${apiUrl}:`, error);
        continue;
      }
    }
    
    throw new Error('All exchange rate APIs failed');
  } catch (error) {
    console.warn(`Failed to get exchange rate for ${fromCurrency} to ${toCurrency}:`, error);
    return 1; // Fallback to 1:1 ratio
  }
}

// Convert amount from one currency to another
export async function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  return amount * rate;
}

// Format currency amount with proper symbol and formatting
export function formatCurrency(amount: number, currencyInfo: CurrencyInfo): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  try {
    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `${currencyInfo.symbol}${amount.toLocaleString()}`;
  }
}

// Get currency info by code
export function getCurrencyInfo(currencyCode: string): CurrencyInfo {
  const currency = Object.values(COUNTRY_CURRENCY_MAP).find(c => c.code === currencyCode);
  return currency || DEFAULT_CURRENCY;
}

// Get all supported currencies for dropdown
export function getAllCurrencies(): CurrencyInfo[] {
  const currencies = Object.values(COUNTRY_CURRENCY_MAP);
  const uniqueCurrencies = currencies.filter((currency, index, array) => 
    array.findIndex(c => c.code === currency.code) === index
  );
  
  return uniqueCurrencies.sort((a, b) => a.name.localeCompare(b.name));
}
