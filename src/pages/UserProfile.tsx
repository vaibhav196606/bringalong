import React from 'react'
import { Link } from 'react-router-dom'

const UserProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Public User Profile Coming Soon!</h2>
          <p className="text-gray-600">View other users' profiles, ratings, and reviews.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
