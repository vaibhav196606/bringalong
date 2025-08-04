import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { apiService } from '../services/api'
import CityAutocomplete from '../components/CityAutocomplete'
import ItemsAutocomplete from '../components/ItemsAutocomplete'
import PostTripSuccessModal from '../components/PostTripSuccessModal'
import { 
  MapPinIcon, 
  CalendarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

const PostTrip: React.FC = () => {
  const { user } = useAuth()
  const { userCurrency, allCurrencies, isLoading: currencyLoading } = useCurrency()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdTripId, setCreatedTripId] = useState<string>('')
  const [formData, setFormData] = useState({
    fromCity: '',
    fromCountry: '',
    toCity: '',
    toCountry: '',
    travelDate: '',
    returnDate: '',
    serviceFee: '',
    currency: userCurrency.code,
    itemsCanBring: [] as string[]
  })

  // Update currency when user's detected currency changes
  useEffect(() => {
    if (!currencyLoading && userCurrency.code) {
      setFormData(prev => ({ ...prev, currency: userCurrency.code }))
    }
  }, [userCurrency.code, currencyLoading])

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('postTripFormData')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(prev => ({ 
          ...parsed, 
          currency: userCurrency.code || prev.currency // Always use current currency
        }))
      } catch (error) {
        console.warn('Failed to parse saved form data:', error)
        localStorage.removeItem('postTripFormData')
      }
    }
  }, [userCurrency.code])

  // Save form data to localStorage when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.values(formData).some(value => 
        (typeof value === 'string' && value !== '') || 
        (Array.isArray(value) && value.length > 0)
      )) {
        localStorage.setItem('postTripFormData', JSON.stringify(formData))
      }
    }, 1000) // Save after 1 second of no changes

    return () => clearTimeout(timeoutId)
  }, [formData])

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Validate required fields
      if (!formData.fromCity || !formData.fromCountry || !formData.toCity || !formData.toCountry) {
        throw new Error('Please fill in all location fields')
      }
      
      if (!formData.travelDate) {
        throw new Error('Travel date is required')
      }

      // Validate dates
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
      const travelDate = new Date(formData.travelDate)
      
      if (travelDate < today) {
        throw new Error('Travel date cannot be in the past')
      }
      
      if (formData.returnDate) {
        const returnDate = new Date(formData.returnDate)
        if (returnDate < travelDate) {
          throw new Error('Return date cannot be before travel date')
        }
      }
      
      if (!formData.serviceFee || parseFloat(formData.serviceFee) <= 0) {
        throw new Error('Please enter a valid service fee')
      }

      // Validate service fee limits based on currency
      const fee = parseFloat(formData.serviceFee)
      const maxFee = formData.currency === 'INR' ? 50000 : 
                    formData.currency === 'USD' ? 1000 :
                    formData.currency === 'EUR' ? 900 :
                    formData.currency === 'GBP' ? 800 : 1000
      
      if (fee > maxFee) {
        throw new Error(`Service fee seems too high. Maximum allowed: ${maxFee} ${formData.currency}`)
      }

      // Validate items
      if (formData.itemsCanBring.length === 0) {
        throw new Error('Please specify at least one item you can bring to help others')
      }

      // Prepare trip data for API
      const tripData = {
        fromCity: formData.fromCity.trim(),
        fromCountry: formData.fromCountry.trim(),
        toCity: formData.toCity.trim(),
        toCountry: formData.toCountry.trim(),
        travelDate: formData.travelDate,
        returnDate: formData.returnDate || undefined,
        serviceFee: parseFloat(formData.serviceFee),
        currency: formData.currency,
        itemsCanBring: formData.itemsCanBring.length > 0 ? formData.itemsCanBring : undefined
      }
      
      // Create abort controller for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      try {
        // Call API to create trip
        const response = await apiService.trips.create(tripData)
        clearTimeout(timeoutId)
        
        // Clear saved form data on successful submission
        localStorage.removeItem('postTripFormData')
        
        // Show success modal instead of immediate redirect
        setCreatedTripId(response.data?._id || response.data?.id || 'created')
        setShowSuccessModal(true)
      } catch (apiError: any) {
        clearTimeout(timeoutId)
        throw apiError
      }
    } catch (error: any) {
      let errorMessage = 'Failed to post trip. Please try again.'
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid trip data. Please check your inputs.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Basic input sanitization - remove potential script tags and trim whitespace
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
  }

  const handleFromCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, fromCity: city }))
  }

  const handleFromCountryChange = (country: string) => {
    setFormData(prev => ({ ...prev, fromCountry: country }))
  }

  const handleToCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, toCity: city }))
  }

  const handleToCountryChange = (country: string) => {
    setFormData(prev => ({ ...prev, toCountry: country }))
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    // Clear any saved form data since trip was successfully created
    localStorage.removeItem('postTripFormData')
    navigate('/trips')
  }

  // Calculate form completion percentage
  const getFormCompletionPercentage = () => {
    const fields = [
      formData.fromCity,
      formData.toCity,
      formData.travelDate,
      formData.serviceFee,
      formData.itemsCanBring.length > 0 ? 'items' : ''
    ]
    const completed = fields.filter(field => field !== '').length
    return Math.round((completed / fields.length) * 100)
  }

  if (!user) {
    return null
  }

  // Show loading while currency is being detected
  if (currencyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading currency settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Post a Trip</h1>
            <p className="mt-2 text-gray-600">
              Share your travel plans and help others get items from your destination
            </p>
            {/* Progress Indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Form Progress</span>
                <span>{getFormCompletionPercentage()}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getFormCompletionPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8" role="form" aria-label="Post a new trip">
            {error && (
              <div 
                role="alert" 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            
            {/* Route Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2" />
                Route Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">From</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <CityAutocomplete
                        value={formData.fromCity}
                        countryValue={formData.fromCountry}
                        placeholder="e.g., New York"
                        onCityChange={handleFromCityChange}
                        onCountryChange={handleFromCountryChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="fromCountry"
                        required
                        value={formData.fromCountry}
                        onChange={handleInputChange}
                        placeholder="e.g., USA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">To</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <CityAutocomplete
                        value={formData.toCity}
                        countryValue={formData.toCountry}
                        placeholder="e.g., London"
                        onCityChange={handleToCityChange}
                        onCountryChange={handleToCountryChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="toCountry"
                        required
                        value={formData.toCountry}
                        onChange={handleInputChange}
                        placeholder="e.g., UK"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2" />
                Travel Dates
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Departure</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="travelDate"
                      required
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Return (Optional)</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      min={formData.travelDate || new Date().toISOString().split('T')[0]} // Return date must be after travel date
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Fee */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BanknotesIcon className="w-6 h-6 mr-2" />
                Service Fee
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="serviceFee"
                    required
                    min="0"
                    step="0.01"
                    value={formData.serviceFee}
                    onChange={handleInputChange}
                    placeholder="50.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency {currencyLoading && <span className="text-xs text-gray-500">(detecting...)</span>}
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {/* User's detected currency first */}
                    <option value={userCurrency.code}>
                      {userCurrency.code} ({userCurrency.symbol}) - {userCurrency.name}
                    </option>
                    {/* Other currencies */}
                    {allCurrencies
                      .filter(currency => currency.code !== userCurrency.code)
                      .map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol}) - {currency.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>

            {/* Items You Can Bring */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Items You Can Bring
              </h2>
              
              <ItemsAutocomplete
                selectedItems={formData.itemsCanBring}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, itemsCanBring: items }))}
                placeholder="Search for items you can bring (electronics, clothing, books, etc.)"
              />
            </div>

            {/* LinkedIn Profile Display */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Your LinkedIn Profile</h3>
              <p className="text-sm text-gray-600 mb-2">
                This will be displayed to requesters for credibility:
              </p>
              <a
                href={user?.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                {user?.linkedinUrl}
              </a>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting Trip...' : 'Post Trip'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <PostTripSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        tripId={createdTripId}
      />
    </div>
  )
}

export default PostTrip
