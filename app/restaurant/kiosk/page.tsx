'use client'

import { useState, useMemo } from 'react'
import { CartItem, MenuItem, Order, calculateKitchenContribution } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Minus, ShoppingCart, X, Check, Clock, AlertCircle, CreditCard, Loader2 } from 'lucide-react'

type KioskState = 'ordering' | 'payment' | 'processing' | 'success'

export default function KioskModePage() {
  const { addOrder, restaurants, addAuditLog, showToast } = useApp()
  // Use first restaurant for demo
  const restaurant = restaurants[0]
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [kioskState, setKioskState] = useState<KioskState>('ordering')
  const [tokenNumber, setTokenNumber] = useState<string | null>(null)

  const menuByCategory = useMemo(() => {
    if (!restaurant) return {}
    return restaurant.menu.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, MenuItem[]>)
  }, [restaurant])

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const kitchenContribution = calculateKitchenContribution(cart)

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id)
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { menuItem, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.menuItem.id === itemId) {
          const newQty = item.quantity + delta
          return newQty <= 0 ? null : { ...item, quantity: newQty }
        }
        return item
      }).filter(Boolean) as CartItem[]
    })
  }

  const handleProceedToPayment = () => {
    setKioskState('payment')
    setShowCart(false)
  }

  const handleProcessPayment = async () => {
    setKioskState('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newTokenNumber = `K-${String(Math.floor(Math.random() * 900) + 100)}`

    const newOrder: Order = {
      id: `kiosk-${Date.now()}`,
      tokenNumber: newTokenNumber,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: [...cart],
      total: cartTotal,
      status: 'accepted', // Kiosk orders are auto-accepted
      createdAt: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
      customerId: 'kiosk-customer',
      notifyOnArrival: false,
      hasArrived: true,
      estimatedPrepTime: kitchenContribution,
      paymentCompleted: true
    }

    addOrder(newOrder)
    addAuditLog({
      type: 'walk_in_created',
      message: `Kiosk order ${newTokenNumber} created`,
      orderId: newOrder.id,
      restaurantId: restaurant.id
    })
    
    setTokenNumber(newTokenNumber)
    setKioskState('success')
    setCart([])

    // Reset after 8 seconds
    setTimeout(() => {
      setKioskState('ordering')
      setTokenNumber(null)
    }, 8000)
  }

  const handleCancelPayment = () => {
    setKioskState('ordering')
    setShowCart(true)
  }

  // Payment Processing Screen
  if (kioskState === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Processing Payment</h1>
            <p className="text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  // Payment Screen
  if (kioskState === 'payment') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Payment Required</h1>
              <p className="text-muted-foreground">Complete payment to place your order</p>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {cart.map(item => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantity}x {item.menuItem.name}</span>
                  <span className="text-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-border pt-4">
              <span>Total</span>
              <span className="text-primary">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg"
                onClick={handleProcessPayment}
              >
                Pay ${cartTotal.toFixed(2)}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCancelPayment}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success Screen
  if (kioskState === 'success' && tokenNumber) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Order Placed!</h1>
            <p className="text-muted-foreground">Your token number is</p>
          </div>
          <h2 className="text-7xl font-bold text-primary">{tokenNumber}</h2>
          <p className="text-muted-foreground">Use this token at the counter</p>
          <div className="bg-muted rounded-lg p-4 max-w-xs mx-auto">
            <p className="text-sm text-muted-foreground">
              Estimated prep time: ~{kitchenContribution} minutes
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main Ordering Screen
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{restaurant?.name}</h1>
            <p className="text-muted-foreground">Touch to order</p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowCart(true)}
            className="bg-primary hover:bg-primary/90 gap-2"
            disabled={cart.length === 0}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold">{cartCount}</span>
            <span className="mx-1">|</span>
            <span>${cartTotal.toFixed(2)}</span>
          </Button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => {
                const inCart = cart.find(c => c.menuItem.id === item.id)
                return (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${!item.available ? 'opacity-50' : ''}`}
                    onClick={() => item.available && addToCart(item)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                      {item.itemType === 'special' && item.available && (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Takes longer
                        </p>
                      )}
                      {inCart && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1) }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold text-lg w-8 text-center">{inCart.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1) }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {!item.available && (
                        <p className="text-xs text-destructive">Unavailable</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Order</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cart.map(item => (
                <div key={item.menuItem.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                      {item.menuItem.itemType === 'special' && (
                        <span className="text-xs text-amber-600">
                          <Clock className="w-3 h-3 inline" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.menuItem.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.menuItem.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border space-y-4">
              {/* Kitchen contribution */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    Adds ~{kitchenContribution} min kitchen time
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
