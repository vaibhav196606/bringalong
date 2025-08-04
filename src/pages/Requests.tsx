import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  BanknotesIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Request {
  _id: string
  requester: {
    _id: string
    name: string
    rating?: number
  }
  trip: {
    _id: string
    origin: {
      city: string
      country: string
    }
    destination: {
      city: string
      country: string
    }
    date: string
    traveler: {
      _id: string
      name: string
      rating?: number
    }
  }
  itemName: string
  itemDescription: string
  maxBudget: number
  urgency: 'low' | 'medium' | 'high'
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

const Requests: React.FC = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      setLoading(true)
      const response = await apiService.requests.getMyRequests()
      setRequests(response.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      setError('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return
    
    try {
      await apiService.requests.updateStatus(requestId, { status: 'cancelled' })
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: 'cancelled' as const } : req
      ))
    } catch (error) {
      console.error('Error cancelling request:', error)
      alert('Failed to cancel request')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'in-transit':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5" />
      case 'accepted':
      case 'in-transit':
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />
      default:
        return <ClockIcon className="w-5 h-5" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600">You need to be logged in to view your requests.</p>
            <Link
              to="/login"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Log In
            </Link>
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
            <p className="mt-4 text-gray-600">Loading your requests...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMyRequests}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-1">Track your item requests and communication with travelers</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h2>
            <p className="text-gray-600 mb-6">
              Start by browsing available trips and requesting items from travelers.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Trips
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {request.itemName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} flex items-center`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{request.itemDescription}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {request.trip.origin.city}, {request.trip.origin.country} → {request.trip.destination.city}, {request.trip.destination.country}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {request.trip.traveler.name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BanknotesIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">Budget: {request.maxBudget}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">Urgency: </span>
                        <span className={`text-sm font-medium ml-1 capitalize ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Requested on {formatDate(request.createdAt)}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/messages?requestId=${request._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Message Traveler
                    </Link>
                    {request.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelRequest(request._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel Request
                      </button>
                    )}
                    {request.status === 'completed' && (
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests
