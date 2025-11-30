import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Truck } from 'lucide-react'

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="NHH Collection"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            NHH Collection
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Premium streetwear and accessories designed for the modern lifestyle. 
            Express yourself with our signature collection.
          </p>
          <div className="mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose NHH</h2>
            <p className="mt-4 text-lg text-gray-600">
              Quality, style, and comfort in every piece
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Premium Quality</h3>
              <p className="mt-2 text-base text-gray-500">
                Crafted with the finest materials for lasting comfort and style.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Fast Shipping</h3>
              <p className="mt-2 text-base text-gray-500">
                Quick and reliable delivery to get your order to you fast.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Unique Designs</h3>
              <p className="mt-2 text-base text-gray-500">
                Exclusive designs that help you stand out from the crowd.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to upgrade your style?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Browse our complete collection and find your perfect piece.
          </p>
          <Link
            to="/shop"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
  )
}