import React from 'react'
import { Link } from 'react-router-dom'
import { 
  CalendarIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import PriceDisplay from './PriceDisplay'

interface TripCardProps {
  trip: {
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
    viewCount?: number
    requestCount?: number
    matchType?: 'exact' | 'broader'
    nearToYou?: boolean
  }
  userLocation?: {
    city?: string
    country: string
    countryCode: string
    region?: string
  } | null
  showLocationIndicator?: boolean
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  userLocation, 
  showLocationIndicator = true 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isReturnTrip = !!trip.returnDate

  // Check if trip is relevant to user's location
  const getLocationRelevance = () => {
    if (!userLocation || !showLocationIndicator) return null
    
    const isFromUserCity = userLocation.city && 
      trip.fromCity.toLowerCase() === userLocation.city.toLowerCase()
    const isToUserCity = userLocation.city && 
      trip.toCity.toLowerCase() === userLocation.city.toLowerCase()
    
    if (isFromUserCity || isToUserCity) {
      return { type: 'city', label: '📍 Your City' }
    }
    
    const isFromUserCountry = userLocation.country && 
      trip.fromCountry.toLowerCase() === userLocation.country.toLowerCase()
    const isToUserCountry = userLocation.country && 
      trip.toCountry.toLowerCase() === userLocation.country.toLowerCase()
    
    if (isFromUserCountry || isToUserCountry) {
      return { type: 'country', label: '🏴 Your Country' }
    }
    
    return null
  }

  const locationRelevance = getLocationRelevance()

  return (
    <Link
      to={`/trip/${trip._id}`}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow block h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center mb-1">
            <div className="text-lg font-semibold text-gray-900 flex items-center min-w-0">
              <span className="truncate">{trip.fromCity}</span>
              {isReturnTrip ? (
                <ArrowsRightLeftIcon className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
              ) : (
                <ArrowRightIcon className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{trip.toCity}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {trip.fromCountry} {isReturnTrip ? '⇄' : '→'} {trip.toCountry}
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          {/* Location and verification indicators */}
          <div className="flex items-center space-x-1 flex-wrap justify-end">
            {locationRelevance && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                locationRelevance.type === 'city' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {locationRelevance.label}
              </span>
            )}
            {trip.nearToYou && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full whitespace-nowrap">
                📍 Near by
              </span>
            )}
            {trip.userId.verified && (
              <ShieldCheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
            )}
          </div>
          
          {/* Service fee */}
          <span className="text-green-600 font-medium whitespace-nowrap">
            <PriceDisplay 
              amount={trip.serviceFee} 
              currency={trip.currency} 
              showOriginal={true}
            />
          </span>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="flex items-start text-gray-600">
          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm min-w-0">
            <div>{formatDate(trip.travelDate)}</div>
            {isReturnTrip && trip.returnDate && (
              <div className="text-gray-600 mt-1">
                Return: {formatDate(trip.returnDate)}
              </div>
            )}
            {/* Add spacer for one-way trips to match return trip height */}
            {!isReturnTrip && (
              <div className="h-5"></div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            {trip.userId.avatar ? (
              <img 
                src={trip.userId.avatar} 
                alt={trip.userId.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{trip.userId.name}</div>
            {trip.userId.verified && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mt-1">
                Verified
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TripCard
