import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { apiService } from '../services/api'
import LocationAutocomplete from '../components/LocationAutocomplete'
import PriceDisplay from '../components/PriceDisplay'
import { 
  MagnifyingGlassIcon,
  MapPinIcon, 
  CalendarIcon,
  ArrowLeftIcon,
  UserIcon,
  ArrowRightIcon
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
  matchType?: 'exact' | 'broader'
  nearToYou?: boolean
}

interface SearchParams {
  fromLocation?: string
  toLocation?: string
  travelDate?: string
}

const SearchResults: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const [exactMatches, setExactMatches] = useState(0)
  const [broaderMatches, setBroaderMatches] = useState(0)
  const [newSearchData, setNewSearchData] = useState({
    fromLocation: '',
    fromCountry: '',
    toLocation: '',
    toCountry: '',
    travelDate: ''
  })

  useEffect(() => {
    // Get search parameters from URL or navigation state
    const urlParams = new URLSearchParams(location.search)
    const params: SearchParams = {
      fromLocation: urlParams.get('from') || '',
      toLocation: urlParams.get('to') || '',
      travelDate: urlParams.get('date') || ''
    }

    setSearchParams(params)
    setNewSearchData({
      fromLocation: params.fromLocation || '',
      fromCountry: '',
      toLocation: params.toLocation || '',
      toCountry: '',
      travelDate: params.travelDate || ''
    })

    searchTrips(params)
  }, [location.search])

  const searchTrips = async (params: SearchParams) => {
    try {
      setLoading(true)
      const apiParams: any = {}
      if (params.fromLocation) apiParams.from = params.fromLocation
      if (params.toLocation) apiParams.to = params.toLocation
      if (params.travelDate) apiParams.fromDate = params.travelDate
      
      const response = await apiService.trips.getAll(apiParams)
      setTrips(response.data.trips || [])
      setExactMatches(response.data.exactMatches || 0)
      setBroaderMatches(response.data.broaderMatches || 0)
    } catch (error) {
      console.error('Error searching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    // For 'from' location, combine city and country if available
    if (newSearchData.fromLocation) {
      const fromLocation = newSearchData.fromCountry ? 
        `${newSearchData.fromLocation}, ${newSearchData.fromCountry}` : 
        newSearchData.fromLocation
      params.set('from', fromLocation)
    }
    
    // For 'to' location, combine city and country if available  
    if (newSearchData.toLocation) {
      const toLocation = newSearchData.toCountry ? 
        `${newSearchData.toLocation}, ${newSearchData.toCountry}` : 
        newSearchData.toLocation
      params.set('to', toLocation)
    }
    
    if (newSearchData.travelDate) params.set('date', newSearchData.travelDate)
    
    navigate(`/search?${params.toString()}`)
  }

  const handleFromLocationChange = (city: string) => {
    setNewSearchData(prev => ({ ...prev, fromLocation: city }))
  }

  const handleFromLocationSelect = (option: any) => {
    setNewSearchData(prev => ({ 
      ...prev, 
      fromLocation: option.value,
      fromCountry: option.country || ''
    }))
  }

  const handleToLocationChange = (city: string) => {
    setNewSearchData(prev => ({ ...prev, toLocation: city }))
  }

  const handleToLocationSelect = (option: any) => {
    setNewSearchData(prev => ({ 
      ...prev, 
      toLocation: option.value,
      toCountry: option.country || ''
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSearchDescription = () => {
    const parts = []
    if (searchParams.fromLocation) parts.push(`from ${searchParams.fromLocation}`)
    if (searchParams.toLocation) parts.push(`to ${searchParams.toLocation}`)
    if (searchParams.travelDate) {
      const searchDate = new Date(searchParams.travelDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time for accurate comparison
      searchDate.setHours(0, 0, 0, 0)
      
      if (searchDate.getTime() === today.getTime()) {
        parts.push(`departing today or after`)
      } else if (searchDate.getTime() > today.getTime()) {
        parts.push(`on or after ${formatDate(searchParams.travelDate)}`)
      } else {
        parts.push(`on ${formatDate(searchParams.travelDate)}`)
      }
    }
    
    return parts.length > 0 ? parts.join(' ') : 'all trips'
  }

  const isReverseTrip = (trip: any) => {
    // Check if this trip is in the reverse direction of what the user searched
    if (!searchParams.fromLocation || !searchParams.toLocation) return false
    
    const searchFrom = searchParams.fromLocation.toLowerCase()
    const searchTo = searchParams.toLocation.toLowerCase()
    const tripFrom = trip.fromCity.toLowerCase()
    const tripTo = trip.toCity.toLowerCase()
    const tripFromCountry = trip.fromCountry.toLowerCase()
    const tripToCountry = trip.toCountry.toLowerCase()
    
    // Check if trip direction is opposite to search direction
    const isReverse = (
      (tripFrom.includes(searchTo) || tripFromCountry.includes(searchTo)) &&
      (tripTo.includes(searchFrom) || tripToCountry.includes(searchFrom))
    )
    
    return isReverse
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-600 mt-2">
                {loading ? 'Searching...' : `${trips.length} trips found ${getSearchDescription()}`}
              </p>
              {!loading && exactMatches > 0 && broaderMatches > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {exactMatches} exact matches • {broaderMatches} nearby alternatives
                </p>
              )}
              {searchParams.fromLocation && searchParams.toLocation && !loading && (
                <p className="text-sm text-blue-600 mt-1">
                  ✈️ Including return trips that can bring items back
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Refined Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Refine Your Search</h3>
          <form onSubmit={handleNewSearch}>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <LocationAutocomplete
                    value={newSearchData.fromLocation}
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
                    value={newSearchData.toLocation}
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
                    value={newSearchData.travelDate}
                    onChange={(e) => setNewSearchData(prev => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors flex items-center"
              >
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Search Trips
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new trips.
            </p>
            <Link
              to="/post-trip"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Post Your Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Exact Matches Section */}
            {trips.filter(trip => trip.matchType !== 'broader').length > 0 && (
              <div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.filter(trip => trip.matchType !== 'broader').map((trip) => {
                    const isReverse = isReverseTrip(trip)
                    return (
                      <div key={trip._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                          {/* Route */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {trip.fromCity} {isReverse ? '↔' : '→'} {trip.toCity}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {trip.fromCountry} {isReverse ? '↔' : '→'} {trip.toCountry}
                              </p>
                              {isReverse && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                                  ↩️ Return trip
                                </span>
                              )}
                            </div>
                            <span className="text-green-600 font-medium">
                              <PriceDisplay 
                                amount={trip.serviceFee} 
                                currency={trip.currency} 
                                showOriginal={true}
                              />
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center text-gray-600 mb-4">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {formatDate(trip.travelDate)}
                            </span>
                          </div>

                          {/* Traveler Info */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {trip.userId.avatar ? (
                                <img
                                  src={trip.userId.avatar}
                                  alt={trip.userId.name}
                                  className="w-8 h-8 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  <UserIcon className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trip.userId.name}</p>
                                {trip.userId.verified && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Link
                            to={`/trip/${trip._id}`}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                          >
                            View Details
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Broader Matches Section */}
            {trips.filter(trip => trip.matchType === 'broader').length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-orange-500" />
                      Similar Routes Near You
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Trips from or to the same country</p>
                  </div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.filter(trip => trip.matchType === 'broader').map((trip) => {
                    const isReverse = isReverseTrip(trip)
                    return (
                      <div key={trip._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-l-4 border-orange-400">
                        <div className="p-6">
                          {/* Route with Near to You tag */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {trip.fromCity} {isReverse ? '↔' : '→'} {trip.toCity}
                                </h3>
                                {trip.nearToYou && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                    📍 Near by
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {trip.fromCountry} {isReverse ? '↔' : '→'} {trip.toCountry}
                              </p>
                              {isReverse && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                                  ↩️ Return trip
                                </span>
                              )}
                            </div>
                            <span className="text-green-600 font-medium">
                              <PriceDisplay 
                                amount={trip.serviceFee} 
                                currency={trip.currency} 
                                showOriginal={true}
                              />
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center text-gray-600 mb-4">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {formatDate(trip.travelDate)}
                            </span>
                          </div>

                          {/* Traveler Info */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {trip.userId.avatar ? (
                                <img
                                  src={trip.userId.avatar}
                                  alt={trip.userId.name}
                                  className="w-8 h-8 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  <UserIcon className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trip.userId.name}</p>
                                {trip.userId.verified && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Link
                            to={`/trip/${trip._id}`}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                          >
                            View Details
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
