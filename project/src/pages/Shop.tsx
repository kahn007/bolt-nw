import React from 'react'
import { ProductCard } from '../components/ProductCard'
import { stripeProducts } from '../stripe-config'

export function Shop() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NHH Collection</h1>
          <p className="text-xl text-gray-600">Premium streetwear and accessories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stripeProducts.map((product) => (
            <ProductCard key={product.priceId} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}