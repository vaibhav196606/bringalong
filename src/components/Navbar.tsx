import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NavbarCurrencySelector from './NavbarCurrencySelector'
import { 
  HomeIcon, 
  MapIcon, 
  CalendarIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
    setIsUserDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (path: string, name: string) => {
    if (name === 'My Trips' && !user) {
      navigate('/auth/login')
      return
    }
    navigate(path)
  }

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Post Trip', path: '/post-trip', icon: MapIcon },
    { name: 'My Trips', path: '/trips', icon: CalendarIcon },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                BringAlong
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.name === 'My Trips' ? (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.name)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Currency Selector */}
                <NavbarCurrencySelector />
                
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Currency Selector for non-logged in users */}
                <NavbarCurrencySelector />
                
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navItems.map((item) => (
                item.name === 'My Trips' ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleNavigation(item.path, item.name)
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
              
              {/* Currency Selector for Mobile */}
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Currency</div>
                <NavbarCurrencySelector className="w-full" />
              </div>
              
              {user ? (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                  </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-1">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
