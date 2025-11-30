import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { getUserSubscription } from '../lib/stripe'
import { getProductByPriceId } from '../stripe-config'

export function Account() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const sub = await getUserSubscription()
        setSubscription(sub)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchSubscription()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const getSubscriptionPlan = () => {
    if (!subscription?.price_id) return 'No active subscription'
    
    const product = getProductByPriceId(subscription.price_id)
    return product?.name || 'Unknown Plan'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Information</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Plan</label>
                <p className="mt-1 text-sm text-gray-900">{getSubscriptionPlan()}</p>
              </div>
              
              {subscription?.subscription_status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {subscription.subscription_status.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}