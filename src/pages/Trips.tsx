import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import ItemsAutocomplete from '../components/ItemsAutocomplete'
import { 
  PlusIcon,
  MapPinIcon,
  CalendarIcon,
  BanknotesIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Trip {
  _id: string
  userId: string
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
  createdAt: string
}

const Trips: React.FC = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [editFormData, setEditFormData] = useState({
    serviceFee: '',
    notes: '',
    itemsCanBring: [] as string[]
  })

  useEffect(() => {
    fetchUserTrips()
  }, [])

  const fetchUserTrips = async () => {
    try {
      setLoading(true)
      const response = await apiService.trips.getMyTrips()
      setTrips(response.data)
    } catch (error) {
      console.error('Error fetching trips:', error)
      // If API is not available, show empty state instead of error
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return
    
    try {
      await apiService.trips.delete(tripId)
      setTrips(trips.filter(trip => trip._id !== tripId))
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Failed to delete trip')
    }
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setEditFormData({
      serviceFee: trip.serviceFee.toString(),
      notes: trip.notes || '',
      itemsCanBring: trip.itemsCanBring || []
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTrip) return

    try {
      const updateData = {
        serviceFee: parseFloat(editFormData.serviceFee),
        notes: editFormData.notes,
        itemsCanBring: editFormData.itemsCanBring
      }

      await apiService.trips.update(editingTrip._id, updateData)
      
      // Update the trip in the local state
      setTrips(trips.map(trip => 
        trip._id === editingTrip._id 
          ? { ...trip, ...updateData }
          : trip
      ))
      
      setEditingTrip(null)
    } catch (error) {
      console.error('Error updating trip:', error)
      alert('Failed to update trip')
    }
  }

  const handleCancelEdit = () => {
    setEditingTrip(null)
    setEditFormData({
      serviceFee: '',
      notes: '',
      itemsCanBring: []
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Trips</h1>
            <p className="text-gray-600 mb-6">Please log in to view and manage your trips.</p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Log In
            </Link>
            <div className="mt-8">
              <p className="text-sm text-gray-500">
                Don't have an account? 
                <Link to="/register" className="text-blue-600 hover:text-blue-700 ml-1">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Manage your posted trips and track requests</p>
          </div>
          <Link
            to="/post-trip"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post New Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No trips posted yet</h2>
            <p className="text-gray-600 mb-6">
              Start earning by posting your upcoming trips and helping others get items from your destination.
            </p>
            <Link
              to="/post-trip"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Post Your First Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {trip.fromCity}, {trip.fromCountry} → {trip.toCity}, {trip.toCountry}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trip.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : trip.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {trip.fromCity}, {trip.fromCountry} → {trip.toCity}, {trip.toCountry}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{formatDate(trip.travelDate)} at {formatTime(trip.travelDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BanknotesIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">Service Fee: {trip.currency} {trip.serviceFee}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <p className="line-clamp-2">{trip.notes || 'No description provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link
                      to={`/trip/${trip._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditTrip(trip)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Trip
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Fee ({editingTrip.currency})
                  </label>
                  <input
                    type="number"
                    name="serviceFee"
                    value={editFormData.serviceFee}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editFormData.notes}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Trip description or additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items I Can Bring
                  </label>
                  <ItemsAutocomplete
                    selectedItems={editFormData.itemsCanBring}
                    onItemsChange={(items) => setEditFormData(prev => ({ ...prev, itemsCanBring: items }))}
                    placeholder="Start typing to search for items..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trips
