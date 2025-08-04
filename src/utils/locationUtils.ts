// Location utilities for trip discovery and location-based filtering

export interface UserLocation {
  city?: string;
  country: string;
  countryCode: string;
  region?: string;
}

// Cache for user location data
let locationCache: { data?: UserLocation; timestamp?: number } = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get user's detailed location using IP geolocation
export async function getUserDetailedLocation(): Promise<UserLocation | null> {
  // Check cache first
  const now = Date.now();
  if (locationCache.data && locationCache.timestamp && 
      (now - locationCache.timestamp) < CACHE_DURATION) {
    return locationCache.data;
  }

  try {
    // Try multiple free IP geolocation services for reliability
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://ipinfo.io/json'
    ];

    for (const service of services) {
      try {
        console.log(`🔍 Getting location from: ${service}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          const location: UserLocation = {
            city: data.city,
            country: data.country_name || data.country,
            countryCode: data.country_code || data.countryCode || data.country,
            region: data.region_name || data.regionName || data.region
          };
          
          console.log(`✅ Location detected:`, location);
          
          // Cache the result
          locationCache = {
            data: location,
            timestamp: now
          };
          
          return location;
        }
      } catch (error) {
        console.warn(`Failed to get location from ${service}:`, error);
        continue;
      }
    }
    
    console.warn('All location services failed');
    return null;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
}

// Calculate location relevance score for trip matching
export function calculateLocationRelevance(userLocation: UserLocation, tripFromCity: string, tripFromCountry: string, tripToCity: string, tripToCountry: string): number {
  let score = 0;
  
  // Exact city match (highest priority)
  if (userLocation.city) {
    if (userLocation.city.toLowerCase() === tripFromCity.toLowerCase() || 
        userLocation.city.toLowerCase() === tripToCity.toLowerCase()) {
      score += 100;
    }
  }
  
  // Country match (medium priority)
  if (userLocation.country) {
    if (userLocation.country.toLowerCase() === tripFromCountry.toLowerCase() || 
        userLocation.country.toLowerCase() === tripToCountry.toLowerCase()) {
      score += 50;
    }
  }
  
  // Country code match (fallback)
  if (userLocation.countryCode) {
    const userCountryCode = userLocation.countryCode.toLowerCase();
    if (tripFromCountry.toLowerCase().includes(userCountryCode) || 
        tripToCountry.toLowerCase().includes(userCountryCode)) {
      score += 25;
    }
  }
  
  return score;
}

// Sort trips by location relevance
export function sortTripsByLocationRelevance(trips: any[], userLocation: UserLocation | null): any[] {
  if (!userLocation) {
    return trips; // Return as-is if no location data
  }
  
  return trips
    .map(trip => ({
      ...trip,
      locationScore: calculateLocationRelevance(
        userLocation,
        trip.fromCity,
        trip.fromCountry,
        trip.toCity,
        trip.toCountry
      )
    }))
    .sort((a, b) => b.locationScore - a.locationScore);
}

// Filter trips by location criteria with fallback
export function filterTripsByLocation(trips: any[], userLocation: UserLocation | null, targetCount: number = 6): any[] {
  if (!userLocation || !trips.length) {
    return trips.slice(0, targetCount);
  }
  
  // Step 1: Try exact city matches
  const cityMatches = trips.filter(trip => {
    if (!userLocation.city) return false;
    const userCity = userLocation.city.toLowerCase();
    return trip.fromCity.toLowerCase() === userCity || trip.toCity.toLowerCase() === userCity;
  });
  
  if (cityMatches.length >= targetCount) {
    return cityMatches.slice(0, targetCount);
  }
  
  // Step 2: Add country matches
  const countryMatches = trips.filter(trip => {
    if (cityMatches.find(ct => ct._id === trip._id)) return false; // Don't duplicate
    if (!userLocation.country) return false;
    const userCountry = userLocation.country.toLowerCase();
    return trip.fromCountry.toLowerCase() === userCountry || trip.toCountry.toLowerCase() === userCountry;
  });
  
  const combinedMatches = [...cityMatches, ...countryMatches];
  
  if (combinedMatches.length >= targetCount) {
    return combinedMatches.slice(0, targetCount);
  }
  
  // Step 3: Fallback to all trips (excluding already included ones)
  const remainingTrips = trips.filter(trip => 
    !combinedMatches.find(ct => ct._id === trip._id)
  );
  
  const finalTrips = [...combinedMatches, ...remainingTrips];
  return finalTrips.slice(0, targetCount);
}

// Clear location cache (for testing or manual refresh)
export function clearLocationCache(): void {
  locationCache = {};
  console.log('🧹 Location cache cleared');
}

// Debug function for testing location-based filtering
export function debugLocationFiltering(trips: any[], userLocation: UserLocation | null): void {
  console.log('🔍 Debug: Location-based trip filtering');
  console.log('User Location:', userLocation);
  
  if (!userLocation || !trips.length) {
    console.log('❌ No location data or trips to filter');
    return;
  }
  
  console.log('\n📍 Step 1: City Matches');
  const cityMatches = trips.filter(trip => {
    if (!userLocation.city) return false;
    const userCity = userLocation.city.toLowerCase();
    const matches = trip.fromCity.toLowerCase() === userCity || trip.toCity.toLowerCase() === userCity;
    if (matches) {
      console.log(`✅ City match: ${trip.fromCity} → ${trip.toCity}`);
    }
    return matches;
  });
  console.log(`Found ${cityMatches.length} city matches`);
  
  console.log('\n🏴 Step 2: Country Matches');
  const countryMatches = trips.filter(trip => {
    if (cityMatches.find(ct => ct._id === trip._id)) return false;
    if (!userLocation.country) return false;
    const userCountry = userLocation.country.toLowerCase();
    const matches = trip.fromCountry.toLowerCase() === userCountry || trip.toCountry.toLowerCase() === userCountry;
    if (matches) {
      console.log(`✅ Country match: ${trip.fromCountry} → ${trip.toCountry}`);
    }
    return matches;
  });
  console.log(`Found ${countryMatches.length} additional country matches`);
  
  console.log('\n🌍 Final Result:');
  const finalTrips = filterTripsByLocation(trips, userLocation, 6);
  console.log(`Showing ${finalTrips.length} trips total`);
  finalTrips.forEach((trip, index) => {
    console.log(`${index + 1}. ${trip.fromCity}, ${trip.fromCountry} → ${trip.toCity}, ${trip.toCountry}`);
  });
}

// Make debug function available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).debugLocationFiltering = debugLocationFiltering;
  (window as any).clearLocationCache = clearLocationCache;
}
