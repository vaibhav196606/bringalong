import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import PriceDisplay from '../components/PriceDisplay'
import SocialShareButtons from '../components/SocialShareButtons'
import { 
  CalendarIcon,
  BanknotesIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface Trip {
  _id: string
  userId: {
    _id: string
    name: string
    avatar?: string
    verified: boolean
    linkedinUrl?: string
    instagramId?: string
    bio?: string
  }
  fromCity: string
  fromCountry: string
  toCity: string
  toCountry: string
  travelDate: string
  returnDate?: string
  serviceFee: number
  currency: string
  notes?: string
  itemsCanBring?: string[]
  status: 'active' | 'completed' | 'cancelled'
  viewCount?: number
  requestCount?: number
  createdAt: string
}

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchTripDetails()
    }
  }, [id])

  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      const response = await apiService.trips.getById(id!)
      setTrip(response.data)
    } catch (error) {
      console.error('Error fetching trip details:', error)
      setError('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkedInConnect = () => {
    if (!user) {
      navigate('/auth/login', { 
        state: { 
          message: 'Please log in first to access user profiles',
          returnTo: window.location.pathname
        } 
      })
      return
    }
    
    if (trip?.userId.linkedinUrl) {
      window.open(trip.userId.linkedinUrl, '_blank', 'noopener,noreferrer')
    } else {
      alert('LinkedIn profile not available for this traveler')
    }
  }

  const handleInstagramConnect = () => {
    if (!user) {
      navigate('/auth/login', { 
        state: { 
          message: 'Please log in first to access user profiles',
          returnTo: window.location.pathname
        } 
      })
      return
    }
    
    if (trip?.userId.instagramId) {
      window.open(`https://instagram.com/${trip.userId.instagramId}`, '_blank', 'noopener,noreferrer')
    } else {
      alert('Instagram profile not available for this traveler')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
            <p className="text-red-600 mb-4">{error || 'This trip does not exist or has been removed.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Browse Trips
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isOwnTrip = user?._id === trip.userId._id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        {/* Trip Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {trip.fromCity}, {trip.fromCountry} → {trip.toCity}, {trip.toCountry}
              </h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{formatDate(trip.travelDate)}</span>
                </div>
                <div className="flex items-center">
                  <BanknotesIcon className="w-5 h-5 mr-2" />
                  <span>Service Fee: <PriceDisplay 
                    amount={trip.serviceFee} 
                    currency={trip.currency} 
                    showOriginal={true}
                  /></span>
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              trip.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : trip.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {trip.status}
            </span>
          </div>

          {/* Traveler Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traveler Information</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-xl font-semibold text-gray-900">{trip.userId.name}</h4>
                  {trip.userId.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                {trip.userId.bio && (
                  <p className="text-gray-600 text-sm mb-3">{trip.userId.bio}</p>
                )}
                {trip.userId.linkedinUrl && (
                  <div className="mt-3">
                    <button 
                      onClick={handleLinkedInConnect}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                      </svg>
                      View LinkedIn Profile
                    </button>
                  </div>
                )}
                {trip.userId.instagramId && (
                  <div className="mt-2">
                    <button 
                      onClick={handleInstagramConnect}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      @{trip.userId.instagramId}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trip Details */}
          {(trip.itemsCanBring?.length || trip.returnDate) && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {trip.itemsCanBring && trip.itemsCanBring.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items I Can Bring</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.itemsCanBring.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {trip.returnDate && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Return Date</h4>
                    <p className="text-gray-600">{formatDate(trip.returnDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Social Share Buttons */}
        <SocialShareButtons
          url={window.location.href}
          title={`Trip: ${trip.fromCity}, ${trip.fromCountry} → ${trip.toCity}, ${trip.toCountry}`}
          description={`Check out this trip from ${trip.fromCity} to ${trip.toCity} on ${formatDate(trip.travelDate)}. Service fee: ${trip.serviceFee} ${trip.currency}. Connect with verified traveler ${trip.userId.name} on our platform!`}
        />

        {/* Action Buttons */}
        {!isOwnTrip && trip.status === 'active' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interested in this trip?
              </h3>
              <p className="text-gray-600 mb-6">
                Connect with the trip owner on LinkedIn to discuss potential collaboration.
              </p>
              
              {!user ? (
                <Link
                  to="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Login to Connect
                </Link>
              ) : (
                <button
                  onClick={handleLinkedInConnect}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                  </svg>
                  Connect on LinkedIn
                </button>
              )}
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            How It Works - Safety Guidelines
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Connect with {trip?.userId.name || 'the traveler'} on LinkedIn
                </h4>
                <p className="text-gray-600 text-sm">
                  Click the LinkedIn connect button above to reach out to the traveler through their verified LinkedIn profile.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Verify Their Profile & Genuineness
                </h4>
                <p className="text-gray-600 text-sm">
                  <strong>Check thoroughly:</strong> Review their current company, work history, and college background. 
                  Look for complete professional profiles with endorsements. Trust your instincts about authenticity.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Agree on Payment Terms
                </h4>
                <p className="text-gray-600 text-sm">
                  Once comfortable with their profile, discuss service fees, item costs, and payment timeline clearly. 
                  Consider secure payment methods for both parties' protection.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Purchase & Deliver Responsibly
                </h4>
                <p className="text-gray-600 text-sm">
                  Buy the requested item as agreed, keep receipts, and coordinate safe delivery. 
                  Both parties should exercise good judgment throughout the process.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Community Responsibility
                </h4>
                <p className="text-gray-600 text-sm">
                  <strong>Important:</strong> We are a non-profit community platform facilitating connections only. 
                  All transactions are between individuals - we are not responsible for any loss or issues.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 text-lg">⚠️</div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Safety First</h4>
                <p className="text-sm text-yellow-700">
                  Always verify profiles thoroughly, meet in safe public places, and trust your instincts. 
                  This is a community of travelers helping each other - exercise the same caution you would with any online interaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetails
