'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@/lib/mock-data'
import { User, Store, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { loginAs } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role)
    if (role === 'customer') {
      router.push('/customer')
    } else if (role === 'restaurant') {
      router.push('/restaurant')
    } else {
      router.push('/admin')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo, just login as customer
    handleDemoLogin('customer')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-xl">KS</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome to KitchenSync</h1>
          <p className="text-muted-foreground">Smart restaurant queue management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue as demo</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('customer')}
                  className="w-full justify-start gap-3"
                >
                  <User className="w-4 h-4 text-primary" />
                  Login as Customer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('restaurant')}
                  className="w-full justify-start gap-3"
                >
                  <Store className="w-4 h-4 text-primary" />
                  Login as Restaurant
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full justify-start gap-3"
                >
                  <Shield className="w-4 h-4 text-primary" />
                  Login as Admin
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
