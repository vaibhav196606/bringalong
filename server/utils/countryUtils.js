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
  
  // Major European Countries
  'germany': ['germany', 'deutschland', 'de'],
  'france': ['france', 'fr'],
  'italy': ['italy', 'italia', 'it'],
  'spain': ['spain', 'españa', 'es'],
  'netherlands': ['netherlands', 'holland', 'nl'],
  'switzerland': ['switzerland', 'ch'],
  'austria': ['austria', 'at'],
  'belgium': ['belgium', 'be'],
  'portugal': ['portugal', 'pt'],
  'greece': ['greece', 'hellas', 'gr'],
  'poland': ['poland', 'pl'],
  'sweden': ['sweden', 'se'],
  'norway': ['norway', 'no'],
  'denmark': ['denmark', 'dk'],
  'finland': ['finland', 'fi'],
  'czech republic': ['czech republic', 'czechia', 'cz'],
  'hungary': ['hungary', 'hu'],
  'romania': ['romania', 'ro'],
  'bulgaria': ['bulgaria', 'bg'],
  'croatia': ['croatia', 'hr'],
  'ireland': ['ireland', 'ie'],
  'slovakia': ['slovakia', 'sk'],
  'slovenia': ['slovenia', 'si'],
  'latvia': ['latvia', 'lv'],
  'lithuania': ['lithuania', 'lt'],
  'estonia': ['estonia', 'ee'],
  'luxembourg': ['luxembourg', 'lu'],
  'malta': ['malta', 'mt'],
  'cyprus': ['cyprus', 'cy'],
  
  // Asian Countries
  'china': ['china', 'prc', "people's republic of china"],
  'india': ['india', 'bharat'],
  'japan': ['japan', 'nippon'],
  'south korea': ['south korea', 'korea', 'republic of korea', 'rok'],
  'north korea': ['north korea', 'dprk', 'democratic peoples republic of korea'],
  'indonesia': ['indonesia'],
  'thailand': ['thailand', 'siam'],
  'singapore': ['singapore'],
  'malaysia': ['malaysia'],
  'philippines': ['philippines', 'ph'],
  'vietnam': ['vietnam', 'viet nam'],
  'taiwan': ['taiwan', 'republic of china', 'roc'],
  'hong kong': ['hong kong', 'hk'],
  'macau': ['macau', 'macao'],
  'pakistan': ['pakistan'],
  'bangladesh': ['bangladesh'],
  'sri lanka': ['sri lanka', 'ceylon'],
  'nepal': ['nepal'],
  'bhutan': ['bhutan'],
  'maldives': ['maldives'],
  'myanmar': ['myanmar', 'burma'],
  'cambodia': ['cambodia'],
  'laos': ['laos'],
  'brunei': ['brunei'],
  'mongolia': ['mongolia'],
  'afghanistan': ['afghanistan'],
  'kazakhstan': ['kazakhstan'],
  'uzbekistan': ['uzbekistan'],
  'kyrgyzstan': ['kyrgyzstan'],
  'tajikistan': ['tajikistan'],
  'turkmenistan': ['turkmenistan'],
  
  // Middle Eastern Countries
  'united arab emirates': ['united arab emirates', 'uae', 'emirates'],
  'saudi arabia': ['saudi arabia', 'ksa'],
  'qatar': ['qatar'],
  'kuwait': ['kuwait'],
  'bahrain': ['bahrain'],
  'oman': ['oman'],
  'israel': ['israel'],
  'palestine': ['palestine'],
  'lebanon': ['lebanon'],
  'jordan': ['jordan'],
  'iran': ['iran', 'persia'],
  'iraq': ['iraq'],
  'syria': ['syria'],
  'yemen': ['yemen'],
  'turkey': ['turkey', 'türkiye'],
  
  // African Countries
  'south africa': ['south africa'],
  'egypt': ['egypt'],
  'nigeria': ['nigeria'],
  'morocco': ['morocco'],
  'tunisia': ['tunisia'],
  'algeria': ['algeria'],
  'libya': ['libya'],
  'kenya': ['kenya'],
  'ethiopia': ['ethiopia'],
  'ghana': ['ghana'],
  'tanzania': ['tanzania'],
  'uganda': ['uganda'],
  'rwanda': ['rwanda'],
  'zambia': ['zambia'],
  'zimbabwe': ['zimbabwe'],
  'botswana': ['botswana'],
  'namibia': ['namibia'],
  'mozambique': ['mozambique'],
  'madagascar': ['madagascar'],
  
  // North American Countries
  'canada': ['canada'],
  'mexico': ['mexico', 'méxico'],
  'guatemala': ['guatemala'],
  'belize': ['belize'],
  'costa rica': ['costa rica'],
  'panama': ['panama'],
  'honduras': ['honduras'],
  'nicaragua': ['nicaragua'],
  'el salvador': ['el salvador'],
  
  // South American Countries
  'brazil': ['brazil', 'brasil'],
  'argentina': ['argentina'],
  'peru': ['peru'],
  'colombia': ['colombia'],
  'chile': ['chile'],
  'venezuela': ['venezuela'],
  'ecuador': ['ecuador'],
  'bolivia': ['bolivia'],
  'uruguay': ['uruguay'],
  'paraguay': ['paraguay'],
  'guyana': ['guyana'],
  'suriname': ['suriname'],
  
  // Oceania
  'australia': ['australia'],
  'new zealand': ['new zealand'],
  'fiji': ['fiji'],
  'papua new guinea': ['papua new guinea'],
  
  // Eastern European Countries
  'russia': ['russia', 'russian federation'],
  'ukraine': ['ukraine'],
  'belarus': ['belarus'],
  'moldova': ['moldova'],
  'georgia': ['georgia'],
  'armenia': ['armenia'],
  'azerbaijan': ['azerbaijan'],
  
  // Caribbean Countries
  'jamaica': ['jamaica'],
  'cuba': ['cuba'],
  'dominican republic': ['dominican republic'],
  'haiti': ['haiti'],
  'trinidad and tobago': ['trinidad and tobago'],
  'barbados': ['barbados'],
  'bahamas': ['bahamas'],
  
  // Other Notable Countries
  'iceland': ['iceland'],
  'greenland': ['greenland'],
  'madagascar': ['madagascar'],
  'maldives': ['maldives'],
  'seychelles': ['seychelles'],
  'mauritius': ['mauritius']
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
