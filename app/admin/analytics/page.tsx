'use client'

import { useApp } from '@/lib/app-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { BarChart3, TrendingUp, Users, DollarSign, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

// Mock data for charts
const weeklyOrders = [
  { day: 'Mon', orders: 45 },
  { day: 'Tue', orders: 52 },
  { day: 'Wed', orders: 48 },
  { day: 'Thu', orders: 61 },
  { day: 'Fri', orders: 75 },
  { day: 'Sat', orders: 88 },
  { day: 'Sun', orders: 67 },
]

const peakHours = [
  { hour: '11am', orders: 12 },
  { hour: '12pm', orders: 28 },
  { hour: '1pm', orders: 35 },
  { hour: '2pm', orders: 22 },
  { hour: '6pm', orders: 18 },
  { hour: '7pm', orders: 32 },
  { hour: '8pm', orders: 38 },
  { hour: '9pm', orders: 25 },
]

const topRestaurants = [
  { name: 'Bella Italia', orders: 156, revenue: 2847.50 },
  { name: 'Tokyo Ramen House', orders: 142, revenue: 2456.80 },
  { name: 'Burger Barn', orders: 128, revenue: 1987.20 },
  { name: 'Spice Garden', orders: 98, revenue: 1654.30 },
  { name: 'El Taco Loco', orders: 87, revenue: 1232.10 },
]

const maxOrders = Math.max(...weeklyOrders.map(d => d.orders))
const maxPeakOrders = Math.max(...peakHours.map(d => d.orders))

export default function AdminAnalyticsPage() {
  const { orders, auditLogs } = useApp()

  // Calculate stats
  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const rejectedOrders = orders.filter(o => o.status === 'rejected').length
  const timeoutOrders = orders.filter(o => o.status === 'timeout').length
  
  const normalItems = orders.flatMap(o => o.items).filter(i => i.menuItem.itemType === 'normal').length
  const specialItems = orders.flatMap(o => o.items).filter(i => i.menuItem.itemType === 'special').length
  const totalItems = normalItems + specialItems
  
  const timeoutRate = totalOrders > 0 ? ((timeoutOrders / totalOrders) * 100).toFixed(1) : '0'
  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-semibold text-foreground">{totalOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-semibold text-foreground">{completionRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeout Rate</p>
                <p className="text-2xl font-semibold text-foreground">{timeoutRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-semibold text-foreground">$23.34</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {weeklyOrders.map(({ day, orders }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                      style={{ height: `${(orders / maxOrders) * 180}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <span className="text-xs font-medium">{orders}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Peak Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {peakHours.map(({ hour, orders }) => (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-amber-500/80 rounded-t-md transition-all hover:bg-amber-500"
                      style={{ height: `${(orders / maxPeakOrders) * 180}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{hour}</span>
                    <span className="text-xs font-medium">{orders}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Normal vs Special Items */}
          <Card>
            <CardHeader>
              <CardTitle>Item Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Normal Items</span>
                    <span className="font-medium">{normalItems} ({totalItems > 0 ? ((normalItems / totalItems) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: totalItems > 0 ? `${(normalItems / totalItems) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Special Items</span>
                    <span className="font-medium">{specialItems} ({totalItems > 0 ? ((specialItems / totalItems) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: totalItems > 0 ? `${(specialItems / totalItems) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Special items have longer prep times and affect kitchen load more significantly
              </p>
            </CardContent>
          </Card>

          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-medium">{completedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <span className="font-medium">{rejectedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Timed Out</span>
                  </div>
                  <span className="font-medium">{timeoutOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Restaurants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRestaurants.slice(0, 4).map((restaurant, index) => (
                  <div key={restaurant.name} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{restaurant.name}</p>
                      <p className="text-xs text-muted-foreground">{restaurant.orders} orders</p>
                    </div>
                    <p className="text-sm font-medium text-primary">${restaurant.revenue.toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No audit logs yet</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.slice(0, 10).map(log => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={
                        log.type === 'order_accepted' ? 'accepted' :
                        log.type === 'order_rejected' ? 'rejected' :
                        log.type === 'order_timeout' ? 'timeout' :
                        'normal'
                      } />
                      <span className="text-sm text-foreground">{log.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString([], { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
