// Popular cities database for autocompletion
export interface CityData {
  city: string;
  country: string;
  countryCode: string;
}

export const citiesDatabase: CityData[] = [
  // United States
  { city: "New York", country: "United States", countryCode: "US" },
  { city: "Los Angeles", country: "United States", countryCode: "US" },
  { city: "Chicago", country: "United States", countryCode: "US" },
  { city: "Houston", country: "United States", countryCode: "US" },
  { city: "Phoenix", country: "United States", countryCode: "US" },
  { city: "Philadelphia", country: "United States", countryCode: "US" },
  { city: "San Antonio", country: "United States", countryCode: "US" },
  { city: "San Diego", country: "United States", countryCode: "US" },
  { city: "Dallas", country: "United States", countryCode: "US" },
  { city: "San Jose", country: "United States", countryCode: "US" },
  { city: "Austin", country: "United States", countryCode: "US" },
  { city: "Jacksonville", country: "United States", countryCode: "US" },
  { city: "Fort Worth", country: "United States", countryCode: "US" },
  { city: "Columbus", country: "United States", countryCode: "US" },
  { city: "Charlotte", country: "United States", countryCode: "US" },
  { city: "San Francisco", country: "United States", countryCode: "US" },
  { city: "Indianapolis", country: "United States", countryCode: "US" },
  { city: "Seattle", country: "United States", countryCode: "US" },
  { city: "Denver", country: "United States", countryCode: "US" },
  { city: "Washington", country: "United States", countryCode: "US" },
  { city: "Boston", country: "United States", countryCode: "US" },
  { city: "El Paso", country: "United States", countryCode: "US" },
  { city: "Nashville", country: "United States", countryCode: "US" },
  { city: "Detroit", country: "United States", countryCode: "US" },
  { city: "Oklahoma City", country: "United States", countryCode: "US" },
  { city: "Portland", country: "United States", countryCode: "US" },
  { city: "Las Vegas", country: "United States", countryCode: "US" },
  { city: "Memphis", country: "United States", countryCode: "US" },
  { city: "Louisville", country: "United States", countryCode: "US" },
  { city: "Baltimore", country: "United States", countryCode: "US" },
  { city: "Milwaukee", country: "United States", countryCode: "US" },
  { city: "Albuquerque", country: "United States", countryCode: "US" },
  { city: "Tucson", country: "United States", countryCode: "US" },
  { city: "Fresno", country: "United States", countryCode: "US" },
  { city: "Sacramento", country: "United States", countryCode: "US" },
  { city: "Mesa", country: "United States", countryCode: "US" },
  { city: "Kansas City", country: "United States", countryCode: "US" },
  { city: "Atlanta", country: "United States", countryCode: "US" },
  { city: "Long Beach", country: "United States", countryCode: "US" },
  { city: "Colorado Springs", country: "United States", countryCode: "US" },
  { city: "Raleigh", country: "United States", countryCode: "US" },
  { city: "Miami", country: "United States", countryCode: "US" },
  { city: "Virginia Beach", country: "United States", countryCode: "US" },
  { city: "Omaha", country: "United States", countryCode: "US" },
  { city: "Oakland", country: "United States", countryCode: "US" },
  { city: "Minneapolis", country: "United States", countryCode: "US" },
  { city: "Tulsa", country: "United States", countryCode: "US" },
  { city: "Arlington", country: "United States", countryCode: "US" },
  { city: "Tampa", country: "United States", countryCode: "US" },
  { city: "New Orleans", country: "United States", countryCode: "US" },

  // Canada
  { city: "Toronto", country: "Canada", countryCode: "CA" },
  { city: "Montreal", country: "Canada", countryCode: "CA" },
  { city: "Vancouver", country: "Canada", countryCode: "CA" },
  { city: "Calgary", country: "Canada", countryCode: "CA" },
  { city: "Edmonton", country: "Canada", countryCode: "CA" },
  { city: "Ottawa", country: "Canada", countryCode: "CA" },
  { city: "Winnipeg", country: "Canada", countryCode: "CA" },
  { city: "Quebec City", country: "Canada", countryCode: "CA" },
  { city: "Hamilton", country: "Canada", countryCode: "CA" },
  { city: "Kitchener", country: "Canada", countryCode: "CA" },

  // United Kingdom
  { city: "London", country: "United Kingdom", countryCode: "GB" },
  { city: "Birmingham", country: "United Kingdom", countryCode: "GB" },
  { city: "Glasgow", country: "United Kingdom", countryCode: "GB" },
  { city: "Liverpool", country: "United Kingdom", countryCode: "GB" },
  { city: "Leeds", country: "United Kingdom", countryCode: "GB" },
  { city: "Sheffield", country: "United Kingdom", countryCode: "GB" },
  { city: "Edinburgh", country: "United Kingdom", countryCode: "GB" },
  { city: "Bristol", country: "United Kingdom", countryCode: "GB" },
  { city: "Manchester", country: "United Kingdom", countryCode: "GB" },
  { city: "Leicester", country: "United Kingdom", countryCode: "GB" },

  // Germany
  { city: "Berlin", country: "Germany", countryCode: "DE" },
  { city: "Hamburg", country: "Germany", countryCode: "DE" },
  { city: "Munich", country: "Germany", countryCode: "DE" },
  { city: "Cologne", country: "Germany", countryCode: "DE" },
  { city: "Frankfurt", country: "Germany", countryCode: "DE" },
  { city: "Stuttgart", country: "Germany", countryCode: "DE" },
  { city: "Düsseldorf", country: "Germany", countryCode: "DE" },
  { city: "Dortmund", country: "Germany", countryCode: "DE" },
  { city: "Essen", country: "Germany", countryCode: "DE" },
  { city: "Leipzig", country: "Germany", countryCode: "DE" },

  // France
  { city: "Paris", country: "France", countryCode: "FR" },
  { city: "Marseille", country: "France", countryCode: "FR" },
  { city: "Lyon", country: "France", countryCode: "FR" },
  { city: "Toulouse", country: "France", countryCode: "FR" },
  { city: "Nice", country: "France", countryCode: "FR" },
  { city: "Nantes", country: "France", countryCode: "FR" },
  { city: "Montpellier", country: "France", countryCode: "FR" },
  { city: "Strasbourg", country: "France", countryCode: "FR" },
  { city: "Bordeaux", country: "France", countryCode: "FR" },
  { city: "Lille", country: "France", countryCode: "FR" },

  // Italy
  { city: "Rome", country: "Italy", countryCode: "IT" },
  { city: "Milan", country: "Italy", countryCode: "IT" },
  { city: "Naples", country: "Italy", countryCode: "IT" },
  { city: "Turin", country: "Italy", countryCode: "IT" },
  { city: "Palermo", country: "Italy", countryCode: "IT" },
  { city: "Genoa", country: "Italy", countryCode: "IT" },
  { city: "Bologna", country: "Italy", countryCode: "IT" },
  { city: "Florence", country: "Italy", countryCode: "IT" },
  { city: "Bari", country: "Italy", countryCode: "IT" },
  { city: "Catania", country: "Italy", countryCode: "IT" },

  // Spain
  { city: "Madrid", country: "Spain", countryCode: "ES" },
  { city: "Barcelona", country: "Spain", countryCode: "ES" },
  { city: "Valencia", country: "Spain", countryCode: "ES" },
  { city: "Seville", country: "Spain", countryCode: "ES" },
  { city: "Zaragoza", country: "Spain", countryCode: "ES" },
  { city: "Málaga", country: "Spain", countryCode: "ES" },
  { city: "Murcia", country: "Spain", countryCode: "ES" },
  { city: "Palma", country: "Spain", countryCode: "ES" },
  { city: "Las Palmas", country: "Spain", countryCode: "ES" },
  { city: "Bilbao", country: "Spain", countryCode: "ES" },

  // Netherlands
  { city: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { city: "Rotterdam", country: "Netherlands", countryCode: "NL" },
  { city: "The Hague", country: "Netherlands", countryCode: "NL" },
  { city: "Utrecht", country: "Netherlands", countryCode: "NL" },
  { city: "Eindhoven", country: "Netherlands", countryCode: "NL" },
  { city: "Tilburg", country: "Netherlands", countryCode: "NL" },
  { city: "Groningen", country: "Netherlands", countryCode: "NL" },
  { city: "Almere", country: "Netherlands", countryCode: "NL" },
  { city: "Breda", country: "Netherlands", countryCode: "NL" },
  { city: "Nijmegen", country: "Netherlands", countryCode: "NL" },

  // Australia
  { city: "Sydney", country: "Australia", countryCode: "AU" },
  { city: "Melbourne", country: "Australia", countryCode: "AU" },
  { city: "Brisbane", country: "Australia", countryCode: "AU" },
  { city: "Perth", country: "Australia", countryCode: "AU" },
  { city: "Adelaide", country: "Australia", countryCode: "AU" },
  { city: "Gold Coast", country: "Australia", countryCode: "AU" },
  { city: "Newcastle", country: "Australia", countryCode: "AU" },
  { city: "Canberra", country: "Australia", countryCode: "AU" },
  { city: "Sunshine Coast", country: "Australia", countryCode: "AU" },
  { city: "Wollongong", country: "Australia", countryCode: "AU" },

  // Japan
  { city: "Tokyo", country: "Japan", countryCode: "JP" },
  { city: "Yokohama", country: "Japan", countryCode: "JP" },
  { city: "Osaka", country: "Japan", countryCode: "JP" },
  { city: "Nagoya", country: "Japan", countryCode: "JP" },
  { city: "Sapporo", country: "Japan", countryCode: "JP" },
  { city: "Fukuoka", country: "Japan", countryCode: "JP" },
  { city: "Kobe", country: "Japan", countryCode: "JP" },
  { city: "Kawasaki", country: "Japan", countryCode: "JP" },
  { city: "Kyoto", country: "Japan", countryCode: "JP" },
  { city: "Saitama", country: "Japan", countryCode: "JP" },

  // China
  { city: "Shanghai", country: "China", countryCode: "CN" },
  { city: "Beijing", country: "China", countryCode: "CN" },
  { city: "Chongqing", country: "China", countryCode: "CN" },
  { city: "Tianjin", country: "China", countryCode: "CN" },
  { city: "Guangzhou", country: "China", countryCode: "CN" },
  { city: "Shenzhen", country: "China", countryCode: "CN" },
  { city: "Wuhan", country: "China", countryCode: "CN" },
  { city: "Dongguan", country: "China", countryCode: "CN" },
  { city: "Chengdu", country: "China", countryCode: "CN" },
  { city: "Nanjing", country: "China", countryCode: "CN" },

  // India
  { city: "Mumbai", country: "India", countryCode: "IN" },
  { city: "Delhi", country: "India", countryCode: "IN" },
  { city: "Bangalore", country: "India", countryCode: "IN" },
  { city: "Hyderabad", country: "India", countryCode: "IN" },
  { city: "Ahmedabad", country: "India", countryCode: "IN" },
  { city: "Chennai", country: "India", countryCode: "IN" },
  { city: "Kolkata", country: "India", countryCode: "IN" },
  { city: "Surat", country: "India", countryCode: "IN" },
  { city: "Pune", country: "India", countryCode: "IN" },
  { city: "Jaipur", country: "India", countryCode: "IN" },
  { city: "Goa", country: "India", countryCode: "IN" },
  { city: "Lucknow", country: "India", countryCode: "IN" },
  { city: "Kanpur", country: "India", countryCode: "IN" },
  { city: "Nagpur", country: "India", countryCode: "IN" },
  { city: "Indore", country: "India", countryCode: "IN" },
  { city: "Thane", country: "India", countryCode: "IN" },
  { city: "Bhopal", country: "India", countryCode: "IN" },
  { city: "Visakhapatnam", country: "India", countryCode: "IN" },
  { city: "Pimpri-Chinchwad", country: "India", countryCode: "IN" },
  { city: "Patna", country: "India", countryCode: "IN" },
  { city: "Vadodara", country: "India", countryCode: "IN" },
  { city: "Ghaziabad", country: "India", countryCode: "IN" },
  { city: "Ludhiana", country: "India", countryCode: "IN" },
  { city: "Agra", country: "India", countryCode: "IN" },
  { city: "Nashik", country: "India", countryCode: "IN" },
  { city: "Faridabad", country: "India", countryCode: "IN" },
  { city: "Meerut", country: "India", countryCode: "IN" },
  { city: "Rajkot", country: "India", countryCode: "IN" },
  { city: "Kalyan-Dombivali", country: "India", countryCode: "IN" },
  { city: "Vasai-Virar", country: "India", countryCode: "IN" },
  { city: "Varanasi", country: "India", countryCode: "IN" },
  { city: "Srinagar", country: "India", countryCode: "IN" },
  { city: "Aurangabad", country: "India", countryCode: "IN" },
  { city: "Dhanbad", country: "India", countryCode: "IN" },
  { city: "Amritsar", country: "India", countryCode: "IN" },
  { city: "Navi Mumbai", country: "India", countryCode: "IN" },
  { city: "Allahabad", country: "India", countryCode: "IN" },
  { city: "Ranchi", country: "India", countryCode: "IN" },
  { city: "Howrah", country: "India", countryCode: "IN" },
  { city: "Coimbatore", country: "India", countryCode: "IN" },
  { city: "Jabalpur", country: "India", countryCode: "IN" },
  { city: "Gwalior", country: "India", countryCode: "IN" },
  { city: "Vijayawada", country: "India", countryCode: "IN" },
  { city: "Jodhpur", country: "India", countryCode: "IN" },
  { city: "Madurai", country: "India", countryCode: "IN" },
  { city: "Raipur", country: "India", countryCode: "IN" },
  { city: "Kota", country: "India", countryCode: "IN" },
  { city: "Chandigarh", country: "India", countryCode: "IN" },
  { city: "Gurgaon", country: "India", countryCode: "IN" },
  { city: "Noida", country: "India", countryCode: "IN" },
  { city: "Udaipur", country: "India", countryCode: "IN" },
  { city: "Mysore", country: "India", countryCode: "IN" },
  { city: "Mangalore", country: "India", countryCode: "IN" },
  { city: "Shimla", country: "India", countryCode: "IN" },
  { city: "Dehradun", country: "India", countryCode: "IN" },
  { city: "Rishikesh", country: "India", countryCode: "IN" },
  { city: "Haridwar", country: "India", countryCode: "IN" },
  { city: "Mussoorie", country: "India", countryCode: "IN" },
  { city: "Darjeeling", country: "India", countryCode: "IN" },
  { city: "Gangtok", country: "India", countryCode: "IN" },
  { city: "Shillong", country: "India", countryCode: "IN" },
  { city: "Kohima", country: "India", countryCode: "IN" },
  { city: "Imphal", country: "India", countryCode: "IN" },
  { city: "Panaji", country: "India", countryCode: "IN" },
  { city: "Port Blair", country: "India", countryCode: "IN" },
  { city: "Leh", country: "India", countryCode: "IN" },
  { city: "Manali", country: "India", countryCode: "IN" },
  { city: "Dharamshala", country: "India", countryCode: "IN" },
  { city: "McLeod Ganj", country: "India", countryCode: "IN" },
  { city: "Pondicherry", country: "India", countryCode: "IN" },
  { city: "Vellore", country: "India", countryCode: "IN" },
  { city: "Tirupati", country: "India", countryCode: "IN" },
  { city: "Salem", country: "India", countryCode: "IN" },
  { city: "Erode", country: "India", countryCode: "IN" },
  { city: "Trichy", country: "India", countryCode: "IN" },
  { city: "Thanjavur", country: "India", countryCode: "IN" },
  { city: "Kochi", country: "India", countryCode: "IN" },
  { city: "Thiruvananthapuram", country: "India", countryCode: "IN" },
  { city: "Kozhikode", country: "India", countryCode: "IN" },
  { city: "Thrissur", country: "India", countryCode: "IN" },
  { city: "Alappuzha", country: "India", countryCode: "IN" },
  { city: "Munnar", country: "India", countryCode: "IN" },
  { city: "Wayanad", country: "India", countryCode: "IN" },
  { city: "Hampi", country: "India", countryCode: "IN" },
  { city: "Gokarna", country: "India", countryCode: "IN" },
  { city: "Udupi", country: "India", countryCode: "IN" },
  { city: "Ajmer", country: "India", countryCode: "IN" },
  { city: "Pushkar", country: "India", countryCode: "IN" },
  { city: "Mount Abu", country: "India", countryCode: "IN" },
  { city: "Bikaner", country: "India", countryCode: "IN" },
  { city: "Jaisalmer", country: "India", countryCode: "IN" },

  // Brazil
  { city: "São Paulo", country: "Brazil", countryCode: "BR" },
  { city: "Rio de Janeiro", country: "Brazil", countryCode: "BR" },
  { city: "Brasília", country: "Brazil", countryCode: "BR" },
  { city: "Salvador", country: "Brazil", countryCode: "BR" },
  { city: "Fortaleza", country: "Brazil", countryCode: "BR" },
  { city: "Belo Horizonte", country: "Brazil", countryCode: "BR" },
  { city: "Manaus", country: "Brazil", countryCode: "BR" },
  { city: "Curitiba", country: "Brazil", countryCode: "BR" },
  { city: "Recife", country: "Brazil", countryCode: "BR" },
  { city: "Goiânia", country: "Brazil", countryCode: "BR" },

  // Mexico
  { city: "Mexico City", country: "Mexico", countryCode: "MX" },
  { city: "Guadalajara", country: "Mexico", countryCode: "MX" },
  { city: "Monterrey", country: "Mexico", countryCode: "MX" },
  { city: "Puebla", country: "Mexico", countryCode: "MX" },
  { city: "Tijuana", country: "Mexico", countryCode: "MX" },
  { city: "León", country: "Mexico", countryCode: "MX" },
  { city: "Juárez", country: "Mexico", countryCode: "MX" },
  { city: "Torreón", country: "Mexico", countryCode: "MX" },
  { city: "Querétaro", country: "Mexico", countryCode: "MX" },
  { city: "San Luis Potosí", country: "Mexico", countryCode: "MX" },

  // Russia
  { city: "Moscow", country: "Russia", countryCode: "RU" },
  { city: "Saint Petersburg", country: "Russia", countryCode: "RU" },
  { city: "Novosibirsk", country: "Russia", countryCode: "RU" },
  { city: "Yekaterinburg", country: "Russia", countryCode: "RU" },
  { city: "Kazan", country: "Russia", countryCode: "RU" },
  { city: "Nizhny Novgorod", country: "Russia", countryCode: "RU" },
  { city: "Chelyabinsk", country: "Russia", countryCode: "RU" },
  { city: "Samara", country: "Russia", countryCode: "RU" },
  { city: "Omsk", country: "Russia", countryCode: "RU" },
  { city: "Rostov-on-Don", country: "Russia", countryCode: "RU" },

  // South Korea
  { city: "Seoul", country: "South Korea", countryCode: "KR" },
  { city: "Busan", country: "South Korea", countryCode: "KR" },
  { city: "Incheon", country: "South Korea", countryCode: "KR" },
  { city: "Daegu", country: "South Korea", countryCode: "KR" },
  { city: "Daejeon", country: "South Korea", countryCode: "KR" },
  { city: "Gwangju", country: "South Korea", countryCode: "KR" },
  { city: "Suwon", country: "South Korea", countryCode: "KR" },
  { city: "Ulsan", country: "South Korea", countryCode: "KR" },
  { city: "Changwon", country: "South Korea", countryCode: "KR" },
  { city: "Goyang", country: "South Korea", countryCode: "KR" },

  // Additional major cities
  { city: "Istanbul", country: "Turkey", countryCode: "TR" },
  { city: "Cairo", country: "Egypt", countryCode: "EG" },
  { city: "Bangkok", country: "Thailand", countryCode: "TH" },
  { city: "Singapore", country: "Singapore", countryCode: "SG" },
  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { city: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { city: "Lima", country: "Peru", countryCode: "PE" },
  { city: "Bogotá", country: "Colombia", countryCode: "CO" },
  { city: "Santiago", country: "Chile", countryCode: "CL" },
  { city: "Caracas", country: "Venezuela", countryCode: "VE" },
  { city: "Johannesburg", country: "South Africa", countryCode: "ZA" },
  { city: "Cape Town", country: "South Africa", countryCode: "ZA" },
  { city: "Lagos", country: "Nigeria", countryCode: "NG" },
  { city: "Casablanca", country: "Morocco", countryCode: "MA" },
  { city: "Tunis", country: "Tunisia", countryCode: "TN" },
  
  // Additional European cities for better country coverage
  { city: "Vienna", country: "Austria", countryCode: "AT" },
  { city: "Brussels", country: "Belgium", countryCode: "BE" },
  { city: "Prague", country: "Czech Republic", countryCode: "CZ" },
  { city: "Copenhagen", country: "Denmark", countryCode: "DK" },
  { city: "Helsinki", country: "Finland", countryCode: "FI" },
  { city: "Athens", country: "Greece", countryCode: "GR" },
  { city: "Budapest", country: "Hungary", countryCode: "HU" },
  { city: "Dublin", country: "Ireland", countryCode: "IE" },
  { city: "Oslo", country: "Norway", countryCode: "NO" },
  { city: "Warsaw", country: "Poland", countryCode: "PL" },
  { city: "Lisbon", country: "Portugal", countryCode: "PT" },
  { city: "Bucharest", country: "Romania", countryCode: "RO" },
  { city: "Stockholm", country: "Sweden", countryCode: "SE" },
  { city: "Zurich", country: "Switzerland", countryCode: "CH" },
  
  // Additional Asian cities
  { city: "Bangkok", country: "Thailand", countryCode: "TH" },
  { city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN" },
  { city: "Jakarta", country: "Indonesia", countryCode: "ID" },
  { city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY" },
  { city: "Manila", country: "Philippines", countryCode: "PH" },
  { city: "Taipei", country: "Taiwan", countryCode: "TW" },
  { city: "Hong Kong", country: "Hong Kong", countryCode: "HK" },
  
  // Additional Middle Eastern cities
  { city: "Tehran", country: "Iran", countryCode: "IR" },
  { city: "Riyadh", country: "Saudi Arabia", countryCode: "SA" },
  { city: "Tel Aviv", country: "Israel", countryCode: "IL" },
  { city: "Doha", country: "Qatar", countryCode: "QA" },
  { city: "Kuwait City", country: "Kuwait", countryCode: "KW" },
  
  // Additional African cities
  { city: "Nairobi", country: "Kenya", countryCode: "KE" },
  { city: "Accra", country: "Ghana", countryCode: "GH" },
  { city: "Addis Ababa", country: "Ethiopia", countryCode: "ET" },
  { city: "Algiers", country: "Algeria", countryCode: "DZ" }
];

export const searchCities = (query: string): CityData[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return citiesDatabase
    .filter(city => 
      city.city.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => {
      // Prioritize exact matches at the beginning
      const aStartsWith = a.city.toLowerCase().startsWith(lowerQuery);
      const bStartsWith = b.city.toLowerCase().startsWith(lowerQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Then sort alphabetically
      return a.city.localeCompare(b.city);
    })
    .slice(0, 10); // Limit to 10 suggestions
};

// Get unique countries for country-only search
export const getUniqueCountries = (): string[] => {
  const countries = [...new Set(citiesDatabase.map(city => city.country))];
  return countries.sort();
};

// Search for countries specifically
export const searchCountries = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  const countries = getUniqueCountries();
  
  return countries
    .filter(country => country.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      // Prioritize exact matches at the beginning
      const aStartsWith = a.toLowerCase().startsWith(lowerQuery);
      const bStartsWith = b.toLowerCase().startsWith(lowerQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return a.localeCompare(b);
    })
    .slice(0, 8); // Limit to 8 country suggestions
};

// Combined search for both cities and countries
export const searchCitiesAndCountries = (query: string): Array<CityData | { country: string; isCountryOnly: boolean }> => {
  if (!query || query.length < 2) return [];
  
  // Get city matches
  const cityMatches = searchCities(query);
  
  // Get country-only matches - show country suggestions for all matching countries
  const countryMatches = searchCountries(query)
    .map(country => ({ country, isCountryOnly: true }));
  
  // Combine results - show countries first for better UX, then cities
  const combined = [...countryMatches, ...cityMatches];
  return combined.slice(0, 12); // Increased limit to show more options
};
