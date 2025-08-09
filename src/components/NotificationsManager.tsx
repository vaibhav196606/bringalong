import React, { useState, useEffect } from 'react';
import { BellIcon, TrashIcon } from '@heroicons/react/24/outline';
import apiService from '../services/api';
import type { TripNotification } from '../types/notifications';

const NotificationsManager: React.FC = () => {
  const [notifications, setNotifications] = useState<TripNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiService.notifications.getMyNotifications();
      setNotifications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiService.notifications.delete(id);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BellIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Trip Notifications</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No active notifications
          </h3>
          <p className="text-gray-600">
            Search for trips and set up notifications when no matches are found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <BellIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.fromCity} → {notification.toCity}
                    </h3>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📍 {notification.fromCountry} → {notification.toCountry}</p>
                    <p>📧 {notification.email}</p>
                    {notification.maxDate && (
                      <p>📅 Maximum travel date: {new Date(notification.maxDate).toLocaleDateString()}</p>
                    )}
                    <p>⏰ Set up on: {new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete notification"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 You'll receive one email when a trip becomes available for this route.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
