import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'
import TripCard from '../components/TripCard'
import LocationAutocomplete from '../components/LocationAutocomplete'
import SEO from '../components/SEO'
import { useCurrency } from '../contexts/CurrencyContext'
import { 
  MagnifyingGlassIcon,
  MapPinIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'

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
  convertedPrice?: number // For frontend sorting by converted currency
}

interface Filters {
  fromLocation: string
  fromCountry: string
  toLocation: string
  toCountry: string
  sortBy: 'date' | 'price'
  sortOrder: 'asc' | 'desc'
}

const AllTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [allTripsForSorting, setAllTripsForSorting] = useState<Trip[]>([]) // All trips for frontend sorting
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTrips, setTotalTrips] = useState(0)
  const [frontendSorting, setFrontendSorting] = useState(false) // Track if we're doing frontend sorting
  const { convertAmount } = useCurrency()
  const [filters, setFilters] = useState<Filters>({
    fromLocation: '',
    fromCountry: '',
    toLocation: '',
    toCountry: '',
    sortBy: 'date',
    sortOrder: 'asc' // Changed to 'asc' for closest dates first
  })
  const [showFilters, setShowFilters] = useState(false)

  const itemsPerPage = 12

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      const isPriceSorting = filters.sortBy === 'price'
      
      const params: any = {
        page: isPriceSorting ? 1 : currentPage, // Get all for price sorting
        limit: isPriceSorting ? 1000 : itemsPerPage // Large limit for price sorting
      }

      // Add filters with combined location info
      if (filters.fromLocation) {
        const fromLocation = filters.fromCountry ? 
          `${filters.fromLocation}, ${filters.fromCountry}` : 
          filters.fromLocation
        params.from = fromLocation
      }
      if (filters.toLocation) {
        const toLocation = filters.toCountry ? 
          `${filters.toLocation}, ${filters.toCountry}` : 
          filters.toLocation
        params.to = toLocation
      }
      
      // Add sorting - skip price sorting for backend, we'll handle it on frontend
      if (!isPriceSorting) {
        params.sortBy = filters.sortBy
        params.sortOrder = filters.sortOrder
      }

      const response = await apiService.trips.getAll(params)
      let fetchedTrips = response.data.trips || []

      if (isPriceSorting) {
        // Convert all prices to user currency for sorting
        setFrontendSorting(true)
        const tripsWithConvertedPrices = await Promise.all(
          fetchedTrips.map(async (trip: Trip) => {
            try {
              const convertedPrice = await convertAmount(trip.serviceFee, trip.currency)
              return { ...trip, convertedPrice }
            } catch (error) {
              console.warn('Failed to convert currency for trip', trip._id, error)
              return { ...trip, convertedPrice: trip.serviceFee } // Fallback to original price
            }
          })
        )

        // Sort by converted price
        tripsWithConvertedPrices.sort((a, b) => {
          const priceA = a.convertedPrice || a.serviceFee
          const priceB = b.convertedPrice || b.serviceFee
          return filters.sortOrder === 'desc' ? priceB - priceA : priceA - priceB
        })

        // Store all trips for pagination
        setAllTripsForSorting(tripsWithConvertedPrices)
        setTotalTrips(tripsWithConvertedPrices.length)
        setTotalPages(Math.ceil(tripsWithConvertedPrices.length / itemsPerPage))

        // Apply frontend pagination
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        setTrips(tripsWithConvertedPrices.slice(startIndex, endIndex))
      } else {
        // Backend sorted results
        setFrontendSorting(false)
        setTrips(fetchedTrips)
        setTotalTrips(response.data.total || 0)
        setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, convertAmount, itemsPerPage])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  // Handle frontend pagination for price sorting
  useEffect(() => {
    if (frontendSorting && allTripsForSorting.length > 0 && filters.sortBy === 'price') {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setTrips(allTripsForSorting.slice(startIndex, endIndex))
    }
  }, [currentPage, frontendSorting, allTripsForSorting, filters.sortBy, itemsPerPage])

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setCurrentPage(1) // Reset to first page when filters change
    
    // Clear frontend sorting data when switching away from price sorting
    if (updatedFilters.sortBy !== 'price' && frontendSorting) {
      setFrontendSorting(false)
      setAllTripsForSorting([])
    }
  }

  const handleFromLocationChange = (city: string) => {
    handleFilterChange({ fromLocation: city })
  }

  const handleFromLocationSelect = (option: any) => {
    handleFilterChange({ 
      fromLocation: option.value,
      fromCountry: option.country || ''
    })
  }

  const handleToLocationChange = (city: string) => {
    handleFilterChange({ toLocation: city })
  }

  const handleToLocationSelect = (option: any) => {
    handleFilterChange({ 
      toLocation: option.value,
      toCountry: option.country || ''
    })
  }

  const clearFilters = () => {
    setFilters({
      fromLocation: '',
      fromCountry: '',
      toLocation: '',
      toCountry: '',
      sortBy: 'date',
      sortOrder: 'asc' // Changed to 'asc' for closest dates first
    })
    setCurrentPage(1)
    // Clear frontend sorting data
    setFrontendSorting(false)
    setAllTripsForSorting([])
  }

  return (
    <>
      <SEO 
        title="All Recent Trips - BringAlong | Find Verified Travelers Worldwide"
        description="Browse all recent trips from verified LinkedIn travelers worldwide. Find someone going to your destination or discover new travel opportunities to bring items across borders."
        keywords="browse trips, find travelers, worldwide trips, verified travelers, LinkedIn travelers, international delivery, travel opportunities"
        url="https://www.bringalong.net/all-trips"
      />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Recent Trips
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all recent trips from verified travelers. Find someone going to your destination or discover new travel opportunities.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filter & Sort</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* From Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">From</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <LocationAutocomplete
                    value={filters.fromLocation}
                    placeholder="Origin city or country"
                    onChange={handleFromLocationChange}
                    onSelect={handleFromLocationSelect}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* To Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">To</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <LocationAutocomplete
                    value={filters.toLocation}
                    placeholder="Destination city or country"
                    onChange={handleToLocationChange}
                    onSelect={handleToLocationSelect}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sort By</label>
                <div className="relative">
                  <ArrowsUpDownIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'date' | 'price' })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Travel Date</option>
                    <option value="price">Service Fee</option>
                  </select>
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                  className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">{filters.sortBy === 'date' ? 'Latest First' : 'Highest First'}</option>
                  <option value="asc">{filters.sortBy === 'date' ? 'Earliest First' : 'Lowest First'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All Filters
              </button>
              <p className="text-sm text-gray-600">
                Showing {trips.length} of {totalTrips} trips
              </p>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new trips.
            </p>
            <Link
              to="/post-trip"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Post Your Trip
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  showLocationIndicator={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  )
}

export default AllTrips
