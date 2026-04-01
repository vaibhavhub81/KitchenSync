'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { 
  Clock, Check, ChefHat, Bell, CheckCircle2, ArrowLeft, 
  MapPin, Navigation, AlertTriangle, RefreshCw
} from 'lucide-react'

const orderSteps = [
  { status: 'waiting_confirmation', label: 'Waiting', icon: Clock, description: 'Waiting for confirmation' },
  { status: 'accepted', label: 'Accepted', icon: Check, description: 'Order confirmed' },
  { status: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Being prepared' },
  { status: 'almost_ready', label: 'Almost Ready', icon: Bell, description: 'Almost done' },
  { status: 'ready', label: 'Ready', icon: CheckCircle2, description: 'Ready for pickup' },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { orders, markOrderArrived, showToast, systemConfig } = useApp()
  const [timeoutCountdown, setTimeoutCountdown] = useState<number | null>(null)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null)
  const [showTimeoutScreen, setShowTimeoutScreen] = useState(false)

  const order = orders.find(o => o.id === params.id)

  // Simulate timeout countdown for waiting_confirmation status
  useEffect(() => {
    if (order?.status === 'waiting_confirmation') {
      const orderTime = new Date(order.createdAt).getTime()
      const timeoutMs = systemConfig.acceptanceTimeout * 60 * 1000
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - orderTime
        const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000))
        setTimeoutCountdown(remaining)
        
        if (remaining === 0) {
          setShowTimeoutScreen(true)
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [order?.status, order?.createdAt, systemConfig.acceptanceTimeout])

  // Simulate location-based distance
  useEffect(() => {
    if (locationEnabled) {
      // Simulate distance (would use real geolocation in production)
      setEstimatedDistance(Math.floor(Math.random() * 15) + 5)
    }
  }, [locationEnabled])

  const handleEnableLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true)
          showToast('Location enabled', 'success')
        },
        () => {
          showToast('Location access denied', 'error')
        }
      )
    } else {
      showToast('Geolocation not supported', 'error')
    }
  }

  const handleArrived = () => {
    if (order) {
      markOrderArrived(order.id)
      showToast('Restaurant notified of your arrival', 'success')
    }
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/customer/orders" className="text-primary hover:underline">
          View all orders
        </Link>
      </div>
    )
  }

  // Timeout screen
  if (showTimeoutScreen && order.status === 'waiting_confirmation') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Order Not Accepted</h2>
            <p className="text-muted-foreground">
              The restaurant did not respond within {systemConfig.acceptanceTimeout} minutes.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <p className="text-sm text-emerald-800 font-medium">Payment will be refunded</p>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Your refund will be processed within 3-5 business days
              </p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => router.push('/customer')}
            >
              Try Another Restaurant
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStepIndex = orderSteps.findIndex(s => s.status === order.status)
  const isCompleted = order.status === 'completed'

  const formatTime = (isoString: string | undefined) => {
    if (!isoString) return null
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Link
          href="/customer/orders"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to orders
        </Link>

        {/* Token Display */}
        <Card>
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your Token Number</p>
            <h1 className="text-5xl font-bold text-primary">{order.tokenNumber}</h1>
            <p className="text-sm text-muted-foreground pt-2">Use this token at the counter</p>
            <div className="pt-2">
              <StatusBadge status={order.status} className="text-sm px-4 py-1" />
            </div>
            {order.status === 'waiting_confirmation' && timeoutCountdown !== null && (
              <div className="pt-2">
                <p className="text-xs text-amber-600">
                  Auto-cancel in {Math.floor(timeoutCountdown / 60)}:{String(timeoutCountdown % 60).padStart(2, '0')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Progress */}
        {!isCompleted && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground mb-6">Order Progress</h2>
              
              <div className="relative">
                {/* Progress bar background */}
                <div className="absolute top-5 left-5 right-5 h-1 bg-muted rounded" />
                
                {/* Progress bar fill */}
                <div 
                  className="absolute top-5 left-5 h-1 bg-primary rounded transition-all duration-500"
                  style={{ width: `calc(${(Math.max(0, currentStepIndex) / (orderSteps.length - 1)) * 100}% - 2.5rem)` }}
                />

                <div className="relative flex justify-between">
                  {orderSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const Icon = step.icon

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors
                            ${isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                            }
                            ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                          `}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Timeline with timestamps */}
              <div className="mt-8 border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order placed</span>
                    <span className="text-foreground">{formatTime(order.createdAt)}</span>
                  </div>
                  {order.acceptedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Accepted</span>
                      <span className="text-foreground">{formatTime(order.acceptedAt)}</span>
                    </div>
                  )}
                  {order.preparingAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Started preparing</span>
                      <span className="text-foreground">{formatTime(order.preparingAt)}</span>
                    </div>
                  )}
                  {order.readyAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ready for pickup</span>
                      <span className="text-foreground">{formatTime(order.readyAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Travel Guidance */}
        {!isCompleted && order.status !== 'waiting_confirmation' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Travel Guidance
              </h2>
              
              {!locationEnabled ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enable location to get travel time estimates
                  </p>
                  <Button variant="outline" onClick={handleEnableLocation}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Enable Location
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      You are ~{estimatedDistance} minutes away
                    </p>
                    {order.status === 'preparing' && (
                      <p className="text-xs text-blue-700 mt-1">
                        Leave now to avoid waiting
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Arrival Notification */}
        {order.notifyOnArrival && !order.hasArrived && order.status !== 'completed' && order.status !== 'waiting_confirmation' && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Arrived at Restaurant?</h2>
              <p className="text-sm text-muted-foreground">
                Let the restaurant know you&apos;ve arrived so they can prioritize your order
              </p>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleArrived}
              >
                <MapPin className="w-4 h-4 mr-2" />
                I Have Arrived
              </Button>
            </CardContent>
          </Card>
        )}

        {order.hasArrived && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">Restaurant has been notified of your arrival</p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-foreground">Order Details</h2>
                <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items.map(item => (
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

            <div className="border-t border-border pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/customer">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
