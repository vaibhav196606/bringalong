import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import PostTrip from './pages/PostTrip'
import Trips from './pages/Trips'
import AllTrips from './pages/AllTrips'
import Profile from './pages/Profile'
import TripDetails from './pages/TripDetails'
import UserProfile from './pages/UserProfile'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import NotificationsManager from './components/NotificationsManager'

function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <ScrollToTop />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/post-trip" element={<PostTrip />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/all-trips" element={<AllTrips />} />
              <Route path="/notifications" element={<NotificationsManager />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/user/:id" element={<UserProfile />} />
              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
              {/* Legacy route redirects */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/register" element={<Navigate to="/auth/register" replace />} />
              {/* Other pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </CurrencyProvider>
  )
}

export default App
