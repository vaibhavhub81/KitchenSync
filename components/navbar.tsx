'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, ClipboardList, User, LogOut, Store, Settings, LayoutDashboard, Menu, ShoppingCart } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, cart } = useApp()

  if (!user) return null

  const customerLinks = [
    { href: '/customer', label: 'Home', icon: Home },
    { href: '/customer/orders', label: 'Orders', icon: ClipboardList },
    { href: '/customer/profile', label: 'Profile', icon: User },
  ]

  const restaurantLinks = [
    { href: '/restaurant', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/restaurant/menu', label: 'Menu', icon: Menu },
    { href: '/restaurant/orders', label: 'Orders', icon: ClipboardList },
    { href: '/restaurant/token', label: 'Token Display', icon: Store },
    { href: '/restaurant/kiosk', label: 'Kiosk', icon: Store },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/restaurants', label: 'Restaurants', icon: Store },
    { href: '/admin/users', label: 'Users', icon: User },
    { href: '/admin/config', label: 'Config', icon: Settings },
    { href: '/admin/analytics', label: 'Analytics', icon: ClipboardList },
  ]

  const links = user.role === 'customer' 
    ? customerLinks 
    : user.role === 'restaurant' 
      ? restaurantLinks 
      : adminLinks

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href={user.role === 'customer' ? '/customer' : user.role === 'restaurant' ? '/restaurant' : '/admin'} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">KS</span>
              </div>
              <span className="font-semibold text-foreground text-lg">KitchenSync</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'customer' && (
              <Link href="/customer/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs capitalize">{user.role}</span>
            </div>

            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-border px-4 py-2 flex gap-1 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              pathname === href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
