import React, { useState } from 'react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { NotificationSearchParams } from '../types/notifications';

interface TripNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchParams: NotificationSearchParams;
}

const TripNotificationModal: React.FC<TripNotificationModalProps> = ({
  isOpen,
  onClose,
  searchParams
}) => {
  const [maxDate, setMaxDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to set up notifications');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.notifications.create({
        ...searchParams,
        maxDate: maxDate || undefined
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMaxDate('');
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    setMaxDate('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BellIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Get Notified
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {!user ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Login Required
            </h4>
            <p className="text-gray-600 mb-4">
              Please log in to set up trip notifications.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Notification Set Up!
            </h4>
            <p className="text-gray-600">
              You'll receive an email when a trip becomes available for this route.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                We'll send you one email notification when a trip becomes available for:
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">
                  {searchParams.fromCity} → {searchParams.toCity}
                </div>
                <div className="text-sm text-blue-700">
                  {searchParams.fromCountry} → {searchParams.toCountry}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="maxDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Travel Date (Optional)
                </label>
                <input
                  type="date"
                  id="maxDate"
                  value={maxDate}
                  onChange={(e) => setMaxDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only notify me for trips on or before this date
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Setting up...' : 'Notify Me'}
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                💡 <strong>One-time notification:</strong> You'll receive only one email per route. 
                LinkedIn verification ensures traveler credibility.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripNotificationModal;
