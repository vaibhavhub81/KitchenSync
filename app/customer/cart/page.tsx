'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { calculateKitchenContribution } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Clock, AlertCircle } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, restaurants, currentRestaurantId } = useApp()

  const restaurant = restaurants.find(r => r.id === currentRestaurantId)
  const kitchenContribution = calculateKitchenContribution(cart)

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some delicious items from our restaurants</p>
          <Link href="/customer">
            <Button className="bg-primary hover:bg-primary/90">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Your Cart</h1>
            {restaurant && (
              <p className="text-sm text-muted-foreground">From {restaurant.name}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            Clear Cart
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {cart.map(item => (
              <div key={item.menuItem.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{item.menuItem.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-primary">${item.menuItem.price.toFixed(2)} each</p>
                      {item.menuItem.itemType === 'special' && (
                        <span className="text-xs text-amber-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Longer prep
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <span className="w-20 text-right font-medium">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.menuItem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kitchen contribution estimate */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Kitchen Time Estimate</p>
              <p className="text-sm text-amber-700">
                Your order adds ~{kitchenContribution} minutes of kitchen time
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-2xl font-semibold text-foreground">${cartTotal.toFixed(2)}</p>
              </div>
              <Link href="/customer/checkout">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
