// Trip Notification Types
export interface TripNotification {
  _id: string;
  userId: string;
  email: string;
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  maxDate?: string;
  notified: boolean;
  createdAt: string;
}

export interface CreateNotificationData {
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  maxDate?: string;
}

export interface NotificationSearchParams {
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
}
