'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { calculateKitchenContribution, getWaitTimeLabel } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, ShoppingCart, Clock, AlertCircle } from 'lucide-react'

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { cart, addToCart, cartTotal, currentRestaurantId, setCurrentRestaurantId, clearCart, restaurants, showToast } = useApp()

  const restaurant = restaurants.find(r => r.id === params.id)

  const menuByCategory = useMemo(() => {
    if (!restaurant) return {}
    return restaurant.menu.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, typeof restaurant.menu>)
  }, [restaurant])

  const kitchenContribution = useMemo(() => {
    return calculateKitchenContribution(cart)
  }, [cart])

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-muted-foreground">Restaurant not found</p>
        <Link href="/customer" className="text-primary hover:underline">
          Back to restaurants
        </Link>
      </div>
    )
  }

  const handleAddToCart = (itemId: string) => {
    const item = restaurant.menu.find(i => i.id === itemId)
    if (!item || !item.available) return

    // If adding from a different restaurant, clear cart first
    if (currentRestaurantId && currentRestaurantId !== restaurant.id) {
      if (confirm('You have items from another restaurant. Clear cart and add this item?')) {
        clearCart()
        setCurrentRestaurantId(restaurant.id)
        addToCart({ menuItem: item, quantity: 1 })
        showToast(`Added ${item.name} to cart`, 'success')
      }
    } else {
      if (!currentRestaurantId) setCurrentRestaurantId(restaurant.id)
      addToCart({ menuItem: item, quantity: 1 })
      showToast(`Added ${item.name} to cart`, 'success')
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const waitLabel = getWaitTimeLabel(restaurant.status, restaurant.waitTime)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{restaurant.name}</h1>
              <StatusBadge status={restaurant.status} />
            </div>
            <p className="text-muted-foreground">{restaurant.cuisine} cuisine</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{waitLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(menuByCategory).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                <div className="grid gap-3">
                  {items.map(item => (
                    <Card key={item.id} className={!item.available ? 'opacity-60' : ''}>
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{item.name}</h3>
                            {!item.available && (
                              <span className="text-xs text-red-500">Unavailable</span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                          )}
                          {/* Show prep time hint for special items */}
                          {item.itemType === 'special' && item.available && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Takes longer to prepare
                            </p>
                          )}
                          <p className="text-sm font-medium text-primary mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          size="icon"
                          onClick={() => handleAddToCart(item.id)}
                          disabled={!item.available}
                          className="shrink-0 bg-primary hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-foreground">Your Cart</h3>
                  {cart.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {cart.map(item => (
                          <div key={item.menuItem.id} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                            <span className="text-muted-foreground">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Kitchen contribution estimate */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-amber-800">Kitchen Time Estimate</p>
                            <p className="text-xs text-amber-700">
                              Your order adds ~{kitchenContribution} minutes of kitchen time
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-3 flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <Link href="/customer/cart">
                    <Button className="w-full bg-primary hover:bg-primary/90" disabled={cart.length === 0}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View Cart ({cartItemCount})
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
