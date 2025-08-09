import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { apiService } from '../services/api'
import LocationAutocomplete from '../components/LocationAutocomplete'
import TripCard from '../components/TripCard'
import { 
  MagnifyingGlassIcon,
  MapPinIcon, 
  CalendarIcon,
  ArrowLeftIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import TripNotificationModal from '../components/TripNotificationModal'

interface Trip {
  _id: string
  fromCity: string
  fromCountry: string
  toCity: string
  toCountry: string
  travelDate: string
  returnDate?: string
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTrips, setTotalTrips] = useState(0)
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
  const [showNotificationModal, setShowNotificationModal] = useState(false)

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

    setCurrentPage(1) // Reset to first page for new search
    searchTrips(params, 1)
  }, [location.search])

  const searchTrips = async (params: SearchParams, page: number = 1) => {
    try {
      setLoading(true)
      const apiParams: any = {
        page,
        limit: 12, // Show 12 trips per page
        sortBy: 'travelDate',
        sortOrder: 'asc' // Show closest dates first
      }
      
      // Only add search parameters if they exist
      if (params.fromLocation) apiParams.from = params.fromLocation
      if (params.toLocation) apiParams.to = params.toLocation
      if (params.travelDate) apiParams.fromDate = params.travelDate
      
      const response = await apiService.trips.getAll(apiParams)
      const responseData = response.data
      
      setTrips(responseData.trips || [])
      setTotalPages(responseData.totalPages || 1)
      setTotalTrips(responseData.total || 0)
      setCurrentPage(page)
      setExactMatches(responseData.exactMatches || 0)
      setBroaderMatches(responseData.broaderMatches || 0)
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
            
            {/* Notification option */}
            {searchParams.fromLocation && searchParams.toLocation && (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <BellIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="text-lg font-medium text-blue-900 mb-2">
                    Get notified when trips are available
                  </h4>
                  <p className="text-blue-700 text-sm mb-3">
                    We'll send you one email when someone posts a trip on this route.
                  </p>
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <BellIcon className="w-4 h-4 mr-2" />
                    Notify Me for This Route
                  </button>
                </div>
              </div>
            )}
            
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
                  {trips.filter(trip => trip.matchType !== 'broader').map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      showLocationIndicator={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Small Notification Reminder at Top (for broader matches only) */}
            {trips.filter(trip => trip.matchType !== 'broader').length === 0 && 
             trips.filter(trip => trip.matchType === 'broader').length > 0 && 
             searchParams.fromLocation && searchParams.toLocation && (
              <div className="mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <BellIcon className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      No exact matches for <strong>{searchParams.fromLocation} → {searchParams.toLocation}</strong>.{' '}
                      <button
                        onClick={() => setShowNotificationModal(true)}
                        className="text-yellow-900 underline hover:text-yellow-700 font-medium"
                      >
                        Get notified when available
                      </button>
                    </span>
                  </div>
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
                    <p className="text-sm text-gray-500 mt-1">Trips from and to the same country</p>
                  </div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.filter(trip => trip.matchType === 'broader').map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      showLocationIndicator={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Notification Section After Broader Matches */}
            {trips.filter(trip => trip.matchType !== 'broader').length === 0 && 
             trips.filter(trip => trip.matchType === 'broader').length > 0 && 
             searchParams.fromLocation && searchParams.toLocation && (
              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <BellIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Want the exact route instead?
                    </h3>
                    <p className="text-blue-700 mb-4">
                      The trips above are from the same region, but not your exact route <strong>{searchParams.fromLocation} → {searchParams.toLocation}</strong>
                    </p>
                    <p className="text-blue-600 text-sm mb-4">
                      Get notified when someone posts a trip on your exact route!
                    </p>
                    <button
                      onClick={() => setShowNotificationModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      <BellIcon className="w-5 h-5 mr-2" />
                      Notify Me for {searchParams.fromLocation} → {searchParams.toLocation}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {trips.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                searchTrips(searchParams, newPage);
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        searchTrips(searchParams, pageNum);
                      }}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                searchTrips(searchParams, newPage);
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Results Summary */}
        {trips.length > 0 && (
          <div className="text-center mt-4 text-gray-600">
            Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalTrips)} of {totalTrips} trips
            {totalPages > 1 && (
              <span className="ml-2">• Page {currentPage} of {totalPages}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Trip Notification Modal */}
      {searchParams.fromLocation && searchParams.toLocation && (
        <TripNotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          searchParams={{
            fromCity: searchParams.fromLocation,
            fromCountry: newSearchData.fromCountry || 'Auto-detected',
            toCity: searchParams.toLocation,
            toCountry: newSearchData.toCountry || 'Auto-detected'
          }}
        />
      )}
    </div>
  )
}

export default SearchResults
