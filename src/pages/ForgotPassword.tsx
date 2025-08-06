import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [resetUrl, setResetUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    
    try {
      const response = await apiService.auth.forgotPassword(email)
      setEmailSent(true)
      setMessage('Password reset instructions have been sent to your email address.')
      
      // In development, store the reset URL to show to user
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                {message}
              </div>
              
              {/* Development mode: Show reset URL directly */}
              {resetUrl && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
                  <p className="font-medium mb-2">🚀 Development Mode:</p>
                  <p className="text-sm mb-2">Since email is not configured, here's your reset link:</p>
                  <a 
                    href={resetUrl}
                    className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                    target="_self"
                  >
                    {resetUrl}
                  </a>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-6">
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                    setMessage('')
                    setResetUrl('')
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try again
                </button>
                
                <Link
                  to="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/auth/login')}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to login
        </button>
        
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
