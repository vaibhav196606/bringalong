# Currency Debug Commands

Add these commands to your browser console to test and debug the currency system:

## Clear All Currency Data and Reload
```javascript
// Clear all currency cache and manual overrides
localStorage.removeItem('manualCurrency');
console.log('🧹 Cleared all currency data');
location.reload();
```

## Force INR Currency (India)
```javascript
// Force India/INR currency
localStorage.setItem('manualCurrency', JSON.stringify({
  code: 'INR', 
  symbol: '₹', 
  name: 'Indian Rupee'
}));
console.log('🇮🇳 Forced INR currency');
location.reload();
```

## Force USD Currency (US)
```javascript
// Force US/USD currency
localStorage.setItem('manualCurrency', JSON.stringify({
  code: 'USD', 
  symbol: '$', 
  name: 'US Dollar'
}));
console.log('🇺🇸 Forced USD currency');
location.reload();
```

## Check Current Currency State
```javascript
// Check what's currently stored
console.log('💰 Current currency state:');
console.log('Manual override:', localStorage.getItem('manualCurrency'));
console.log('Detected country from cache:', 'Check network tab for API calls');
```

## Test Currency Conversion
```javascript
// Test currency conversion (run after page loads)
if (window.convertCurrency) {
  window.convertCurrency(100, 'USD', 'INR').then(result => {
    console.log('💱 $100 USD = ₹' + result + ' INR');
  });
}
```

## Debug Location Detection APIs
```javascript
// Test each geolocation API manually
const apis = [
  'https://ipapi.co/json/',
  'https://ip-api.com/json/', 
  'https://ipinfo.io/json'
];

apis.forEach(async (api) => {
  try {
    const response = await fetch(api);
    const data = await response.json();
    console.log(`🌍 ${api}:`, data);
  } catch (error) {
    console.log(`❌ ${api}: Failed -`, error.message);
  }
});
```

## Debug Location-Based Trip Filtering
```javascript
// Check how location-based trip filtering works
// This will show which trips match your city/country
debugLocationFiltering(trips, userLocation);

// Clear location cache and re-detect
clearLocationCache();
location.reload();
```

## Test Location Override
```javascript
// Override your location for testing
const testLocation = {
  city: 'Mumbai',
  country: 'India',
  countryCode: 'IN'
};

// This would show how trips would be filtered for Mumbai, India
debugLocationFiltering(allTrips, testLocation);
```
