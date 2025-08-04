import { useState, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showOriginal?: boolean;
}

export function PriceDisplay({ amount, currency, className = '', showOriginal = false }: PriceDisplayProps) {
  const { convertAndFormat, userCurrency } = useCurrency();
  const [convertedPrice, setConvertedPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const convertPrice = async () => {
      try {
        setIsLoading(true);
        const formatted = await convertAndFormat(amount, currency);
        setConvertedPrice(formatted);
      } catch (error) {
        console.warn('Failed to convert price:', error);
        // Fallback to original price
        setConvertedPrice(`${currency} ${amount}`);
      } finally {
        setIsLoading(false);
      }
    };

    convertPrice();
  }, [amount, currency, convertAndFormat]);

  if (isLoading) {
    return (
      <span className={`animate-pulse text-gray-500 ${className}`}>
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-bounce"></span>
        Converting...
      </span>
    );
  }

  // If the currency is the same as user's currency or conversion failed, show original
  if (currency === userCurrency.code || !convertedPrice.includes(userCurrency.symbol)) {
    return (
      <span className={className}>
        {convertedPrice}
      </span>
    );
  }

  return (
    <span className={className}>
      {convertedPrice}
      {showOriginal && (
        <span className="text-xs text-gray-500 ml-1">
          (≈ {currency} {amount})
        </span>
      )}
    </span>
  );
}

export default PriceDisplay;
