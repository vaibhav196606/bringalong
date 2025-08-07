import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import LocationAutocomplete from '../components/LocationAutocomplete'
import PriceDisplay from '../components/PriceDisplay'
import SEO from '../components/SEO'
import { getUserDetailedLocation, filterTripsByLocation, debugLocationFiltering, type UserLocation } from '../utils/locationUtils'
import { 
  MagnifyingGlassIcon,
  MapPinIcon, 
  CalendarIcon,
  BanknotesIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Trip {
  _id: string
  fromCity: string
  fromCountry: string
  toCity: string
  toCountry: string
  travelDate: string
  serviceFee: number
  currency: string
  userId: {
    _id: string
    name: string
    rating: number
    verified: boolean
    avatar?: string
  }
  viewCount: number
  requestCount: number
}

const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    fromLocation: '',
    fromCountry: '',
    toLocation: '',
    toCountry: '',
    travelDate: ''
  })
  const [tripsAroundYou, setTripsAroundYou] = useState<Trip[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(true)
  const [stats, setStats] = useState({
    completedTrips: 0,
    totalUsers: 0,
    beneficiaries: 0
  })

  useEffect(() => {
    // Load user location, trips, and stats simultaneously
    Promise.all([
      detectUserLocation(),
      fetchAllTrips(),
      fetchStats()
    ]).then(([location, trips, statsData]) => {
      // Debug the filtering process
      if (location && trips.length > 0) {
        debugLocationFiltering(trips, location);
      }
      
      // Apply location-based filtering
      const filteredTrips = filterTripsByLocation(trips, location, 6)
      setTripsAroundYou(filteredTrips)
      setStats(statsData)
      setLoading(false)
    }).catch(error => {
      console.error('Error loading data:', error)
      setLoading(false)
    })
  }, [])

  const detectUserLocation = async (): Promise<UserLocation | null> => {
    try {
      setLocationLoading(true)
      const location = await getUserDetailedLocation()
      setUserLocation(location)
      
      // User location detected for trip filtering
      
      setLocationLoading(false)
      return location
    } catch (error) {
      console.error('Error detecting location:', error)
      setLocationLoading(false)
      return null
    }
  }

  const fetchAllTrips = async (): Promise<Trip[]> => {
    try {
      const response = await apiService.trips.getAll({ limit: 20 }) // Get more trips for better filtering
      return response.data.trips || []
    } catch (error) {
      console.error('Error fetching trips:', error)
      return []
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiService.stats()
      return response.data.data
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback stats if API fails
      return {
        completedTrips: 150,
        totalUsers: 105,
        beneficiaries: 284
      }
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build search parameters with full location info
    const params = new URLSearchParams()
    
    // For 'from' location, combine city and country if available
    if (searchData.fromLocation) {
      const fromLocation = searchData.fromCountry ? 
        `${searchData.fromLocation}, ${searchData.fromCountry}` : 
        searchData.fromLocation
      params.set('from', fromLocation)
    }
    
    // For 'to' location, combine city and country if available  
    if (searchData.toLocation) {
      const toLocation = searchData.toCountry ? 
        `${searchData.toLocation}, ${searchData.toCountry}` : 
        searchData.toLocation
      params.set('to', toLocation)
    }
    
    if (searchData.travelDate) params.set('date', searchData.travelDate)
    
    // Navigate to search results page
    navigate(`/search?${params.toString()}`)
  }

  const handleFromLocationChange = (city: string) => {
    setSearchData(prev => ({ ...prev, fromLocation: city }))
  }

  const handleFromLocationSelect = (option: any) => {
    setSearchData(prev => ({ 
      ...prev, 
      fromLocation: option.value,
      fromCountry: option.country || ''
    }))
  }

  const handleToLocationChange = (city: string) => {
    setSearchData(prev => ({ ...prev, toLocation: city }))
  }

  const handleToLocationSelect = (option: any) => {
    setSearchData(prev => ({ 
      ...prev, 
      toLocation: option.value,
      toCountry: option.country || ''
    }))
  }

  const features = [
    {
      icon: TruckIcon,
      title: 'Connect with Travelers',
      description: 'Find travelers going to your desired destinations and connect with them.',
      color: 'text-blue-600'
    },
    {
      icon: BanknotesIcon,
      title: 'Offer Your Services',
      description: 'Post your trips and offer to help others while earning service fees.',
      color: 'text-green-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'LinkedIn Verified',
      description: 'All travelers are verified through LinkedIn for trust and safety.',
      color: 'text-purple-600'
    },
    {
      icon: UsersIcon,
      title: 'Global Community',
      description: 'Connect with travelers worldwide and build lasting relationships.',
      color: 'text-pink-600'
    }
  ]

  return (
    <>
      <SEO 
        title="BringAlong - Connect with Verified Travelers | Global Item Delivery Platform"
        description="Connect with verified LinkedIn travelers to bring items from around the world. Post trips, request items, and earn service fees while helping others get products from different countries safely and affordably."
        keywords="travel delivery, international shipping, traveler platform, bring items, global delivery, LinkedIn verified travelers, item requests, travel service, international shopping, peer-to-peer delivery"
        url="https://www.bringalong.net/"
      />
      <div className="bg-white">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              BringAlong
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-4xl mx-auto">
              Connect with verified travelers on LinkedIn. Find people going to your destination 
              or post your trip to help others while earning service fees.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block mb-8">
              <p className="text-sm font-medium text-white">
                🌍 Non-Profit Community • 💰 No Platform Fees • 🤝 Keep 100% of Service Fees
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 text-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-center">Find Travelers Going Your Way</h3>
            <form onSubmit={handleSearch}>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <LocationAutocomplete
                      value={searchData.fromLocation}
                      placeholder="Origin city or country"
                      onChange={handleFromLocationChange}
                      onSelect={handleFromLocationSelect}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <LocationAutocomplete
                      value={searchData.toLocation}
                      placeholder="Destination city or country"
                      onChange={handleToLocationChange}
                      onSelect={handleToLocationSelect}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.travelDate}
                      onChange={(e) => setSearchData(prev => ({ ...prev, travelDate: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Search Trips
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Trips Around You */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {userLocation ? `Trips Around ${userLocation.city || userLocation.country}` : 'Trips Around You'}
            </h2>
            <p className="text-lg text-gray-600">
              {locationLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Detecting your location...
                </span>
              ) : userLocation ? (
                `Discover travelers from and to your area - ${userLocation.city ? `${userLocation.city}, ` : ''}${userLocation.country}`
              ) : (
                'Browse upcoming trips from verified travelers worldwide'
              )}
            </p>
            {userLocation && (
              <div className="mt-4 text-sm text-gray-500">
                📍 Showing trips relevant to your location • 
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:text-blue-700 ml-1"
                >
                  Refresh location
                </button>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading trips...</p>
              </div>
            ) : tripsAroundYou.length > 0 ? (
              tripsAroundYou.map((trip: Trip) => (
                <Link
                  key={trip._id}
                  to={`/trip/${trip._id}`}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {trip.fromCity} → {trip.toCity}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Location relevance indicator */}
                      {userLocation && (() => {
                        const isFromUserCity = userLocation.city && 
                          trip.fromCity.toLowerCase() === userLocation.city.toLowerCase();
                        const isToUserCity = userLocation.city && 
                          trip.toCity.toLowerCase() === userLocation.city.toLowerCase();
                        
                        if (isFromUserCity || isToUserCity) {
                          return (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              📍 Your City
                            </span>
                          );
                        }
                        return null;
                      })()}
                      {trip.userId.verified && (
                        <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(trip.travelDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BanknotesIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Service Fee: <PriceDisplay 
                          amount={trip.serviceFee} 
                          currency={trip.currency} 
                          showOriginal={true}
                        />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{trip.userId.name}</div>
                        {trip.userId.verified && (
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">
                  No trips available at the moment.
                </p>
                {user && (
                  <Link
                    to="/post-trip"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Post the First Trip
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/all-trips"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Trips
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Community Impact Stats */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Community Impact
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Real numbers from our growing <span className="font-semibold text-blue-600">non-profit community</span>
            </p>
            <p className="text-sm text-gray-500">
              🚫 No platform fees • 💰 Travelers keep 100% of service fees
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
                  {loading ? (
                    <div className="animate-pulse bg-blue-200 h-16 w-32 mx-auto rounded"></div>
                  ) : (
                    `${stats.completedTrips.toLocaleString()}+`
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Total Trips</h3>
                <p className="text-sm text-gray-600">Connections made worldwide</p>
                <div className="mt-4 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-xs text-blue-600 font-medium">Growing Daily</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-100">
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-4">
                  {loading ? (
                    <div className="animate-pulse bg-green-200 h-16 w-32 mx-auto rounded"></div>
                  ) : (
                    `${stats.beneficiaries.toLocaleString()}+`
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">People Helped</h3>
                <p className="text-sm text-gray-600">Successfully received items</p>
                <div className="mt-4 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-xs text-green-600 font-medium">Lives Impacted</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-100">
                <div className="text-5xl md:text-6xl font-bold text-purple-600 mb-4">
                  {loading ? (
                    <div className="animate-pulse bg-purple-200 h-16 w-32 mx-auto rounded"></div>
                  ) : (
                    `${stats.totalUsers.toLocaleString()}+`
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Users</h3>
                <p className="text-sm text-gray-600">Verified community members</p>
                <div className="mt-4 flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-xs text-purple-600 font-medium">LinkedIn Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Choose Our Community?
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">100% Verified</span>
                  <span className="text-xs text-gray-500">LinkedIn Required</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <BanknotesIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Zero Fees</span>
                  <span className="text-xs text-gray-500">Non-Profit Platform</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <UsersIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Global Reach</span>
                  <span className="text-xs text-gray-500">Worldwide Network</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <TruckIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Reliable</span>
                  <span className="text-xs text-gray-500">Trusted Deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and trusted way to get items from anywhere in the world
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className={`${feature.color} mb-4 flex justify-center`}>
                  <feature.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of trusted travelers and start connecting today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/post-trip"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Post a Trip
                </Link>
                <Link
                  to="/trips"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Browse Trips
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Join as Traveler
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Find Items
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">BringAlong</h3>
            <p className="text-gray-400 text-sm">A non-profit community helping travelers and requesters connect</p>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 BringAlong. A non-profit community platform with no fees.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Connecting travelers • No platform fees • Community first
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Home
