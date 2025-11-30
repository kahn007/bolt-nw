import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { signOut } from '../lib/auth'

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              NHH Store
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-1" />
              Shop
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="text-gray-700 hover:text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-1" />
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900 flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}