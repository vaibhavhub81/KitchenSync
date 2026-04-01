'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Order, calculateKitchenContribution } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, CreditCard, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type CheckoutState = 'form' | 'processing' | 'success' | 'error'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, addOrder, currentRestaurantId, user, restaurants, showToast } = useApp()
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('form')
  const [notifyOnArrival, setNotifyOnArrival] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  const restaurant = restaurants.find(r => r.id === currentRestaurantId)
  const kitchenContribution = calculateKitchenContribution(cart)

  const handlePlaceOrder = async () => {
    if (!user || !restaurant) return

    setCheckoutState('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const tokenNumber = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${String(Math.floor(Math.random() * 900) + 100)}`
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tokenNumber,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: [...cart],
      total: cartTotal,
      status: 'waiting_confirmation',
      createdAt: new Date().toISOString(),
      customerId: user.id,
      notifyOnArrival,
      hasArrived: false,
      estimatedPrepTime: kitchenContribution,
      paymentCompleted: true
    }

    addOrder(newOrder)
    setCreatedOrder(newOrder)
    setCheckoutState('success')
    showToast('Payment successful!', 'success')
    clearCart()

    // Redirect to order tracking after showing success
    setTimeout(() => {
      router.push(`/customer/order/${newOrder.id}`)
    }, 2000)
  }

  if (cart.length === 0 && checkoutState === 'form') {
    router.push('/customer/cart')
    return null
  }

  // Payment processing state
  if (checkoutState === 'processing') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Processing Payment</h2>
            <p className="text-muted-foreground">Please wait while we process your payment...</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Secure payment processing</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment success state
  if (checkoutState === 'success' && createdOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Payment Successful!</h2>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-2">Your Token Number</p>
              <p className="text-4xl font-bold text-primary">{createdOrder.tokenNumber}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800">Waiting for Confirmation</p>
                  <p className="text-xs text-amber-700">
                    Your order has been placed. Waiting for restaurant confirmation.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Redirecting to order tracking...</p>
          </CardContent>
        </Card>
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
          Back to cart
        </button>

        <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" defaultValue="12/25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" defaultValue="123" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Lock className="w-3 h-3" />
                  <span>Your payment information is secure</span>
                </div>
              </CardContent>
            </Card>

            {/* Arrival Notification Option */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notifyArrival"
                    checked={notifyOnArrival}
                    onCheckedChange={(checked) => setNotifyOnArrival(checked === true)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="notifyArrival" className="font-medium cursor-pointer">
                      Notify restaurant when I arrive
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll let the restaurant know when you&apos;re nearby so they can prioritize your order
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {restaurant && (
                  <div className="pb-3 border-b border-border">
                    <p className="font-medium text-foreground">{restaurant.name}</p>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="text-foreground">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Kitchen time estimate */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Estimated kitchen time: ~{kitchenContribution} minutes
                  </p>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="text-foreground">$0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Pay & Place Order
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Payment is required to join the queue
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
