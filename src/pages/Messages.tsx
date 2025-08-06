import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const Messages: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600">You need to be logged in to view your messages.</p>
            <Link
              to="/auth/login"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">In-App Messaging Coming Soon!</h2>
          <p className="text-gray-600">
            Communicate directly with travelers and requesters through our secure messaging system.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Messages
