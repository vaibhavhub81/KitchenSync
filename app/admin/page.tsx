'use client'

import { mockStats, mockRestaurants, mockOrders } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, ClipboardList, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    title: 'Total Restaurants',
    value: mockStats.totalRestaurants,
    icon: Store,
    change: '+2',
    changeType: 'positive' as const
  },
  {
    title: 'Active Orders',
    value: mockStats.activeOrders,
    icon: ClipboardList,
    change: '+5',
    changeType: 'positive' as const
  },
  {
    title: 'Total Users',
    value: mockStats.totalUsers,
    icon: Users,
    change: '+12',
    changeType: 'positive' as const
  },
  {
    title: 'Today\'s Revenue',
    value: `$${mockStats.revenue.toFixed(2)}`,
    icon: DollarSign,
    change: '+8%',
    changeType: 'positive' as const
  }
]

export default function AdminDashboardPage() {
  // Calculate some quick stats
  const activeRestaurants = mockRestaurants.filter(r => r.status !== 'overloaded').length
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your restaurant network</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-sm">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last week</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{order.tokenNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Status */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRestaurants.slice(0, 5).map(restaurant => (
                  <div key={restaurant.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{restaurant.name}</p>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <div className="text-right">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${restaurant.status === 'normal' ? 'bg-emerald-50 text-emerald-700' : ''}
                        ${restaurant.status === 'busy' ? 'bg-amber-50 text-amber-700' : ''}
                        ${restaurant.status === 'overloaded' ? 'bg-red-50 text-red-700' : ''}
                      `}>
                        {restaurant.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
