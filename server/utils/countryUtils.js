// Country mapping and detection utilities
export const countryMappings = {
  // United States variations
  'united states': ['united states', 'usa', 'us', 'america', 'united states of america'],
  'usa': ['united states', 'usa', 'us', 'america', 'united states of america'],
  'america': ['united states', 'usa', 'us', 'america', 'united states of america'],
  
  // United Kingdom variations  
  'united kingdom': ['united kingdom', 'uk', 'britain', 'great britain', 'england'],
  'uk': ['united kingdom', 'uk', 'britain', 'great britain', 'england'],
  'britain': ['united kingdom', 'uk', 'britain', 'great britain', 'england'],
  'england': ['united kingdom', 'uk', 'britain', 'great britain', 'england'],
  
  // Other countries
  'germany': ['germany', 'deutschland'],
  'france': ['france'],
  'italy': ['italy', 'italia'],
  'spain': ['spain', 'españa'],
  'netherlands': ['netherlands', 'holland'],
  'australia': ['australia'],
  'japan': ['japan', 'nippon'],
  'china': ['china', 'prc', "people's republic of china"],
  'india': ['india', 'bharat'],
  'brazil': ['brazil', 'brasil'],
  'mexico': ['mexico', 'méxico'],
  'russia': ['russia', 'russian federation'],
  'south korea': ['south korea', 'korea', 'republic of korea'],
  'canada': ['canada'],
  'turkey': ['turkey', 'türkiye'],
  'egypt': ['egypt'],
  'thailand': ['thailand'],
  'singapore': ['singapore'],
  'united arab emirates': ['united arab emirates', 'uae', 'emirates'],
  'argentina': ['argentina'],
  'peru': ['peru'],
  'colombia': ['colombia'],
  'chile': ['chile'],
  'venezuela': ['venezuela'],
  'south africa': ['south africa'],
  'nigeria': ['nigeria'],
  'morocco': ['morocco'],
  'tunisia': ['tunisia']
};

// Get all possible country names (normalized)
export const getAllCountryVariations = () => {
  const variations = new Set();
  Object.values(countryMappings).forEach(variants => {
    variants.forEach(variant => variations.add(variant.toLowerCase()));
  });
  return Array.from(variations);
};

// Check if a search term is likely a country search
export const isCountrySearch = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return false;
  
  const term = searchTerm.toLowerCase().trim();
  const allCountries = getAllCountryVariations();
  
  // Check for exact matches or partial matches for longer country names
  return allCountries.some(country => {
    if (term === country) return true;
    if (term.length >= 4 && country.includes(term)) return true;
    if (country.length >= 4 && term.includes(country)) return true;
    return false;
  });
};

// Get the normalized country name for searching
export const getNormalizedCountryName = (searchTerm) => {
  if (!searchTerm) return null;
  
  const term = searchTerm.toLowerCase().trim();
  
  // Find which country group this term belongs to
  for (const [mainCountry, variations] of Object.entries(countryMappings)) {
    if (variations.some(variant => 
      variant === term || 
      (term.length >= 4 && variant.includes(term)) ||
      (variant.length >= 4 && term.includes(variant))
    )) {
      // Return the main country name for consistent searching
      return mainCountry;
    }
  }
  
  // If not found in mappings, return the original term
  return term;
};

// Create a regex pattern that matches all variations of a country
export const createCountryRegex = (searchTerm) => {
  const normalizedCountry = getNormalizedCountryName(searchTerm);
  if (!normalizedCountry || !countryMappings[normalizedCountry]) {
    // Fallback to original search term with word boundaries
    return new RegExp(`\\b${searchTerm}\\b`, 'i');
  }
  
  // Create regex that matches any variation of the country with word boundaries
  const variations = countryMappings[normalizedCountry];
  const escapedVariations = variations.map(v => {
    // Escape special regex characters and add word boundaries
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `\\b${escaped}\\b`;
  });
  const pattern = `(${escapedVariations.join('|')})`;
  
  return new RegExp(pattern, 'i');
};
