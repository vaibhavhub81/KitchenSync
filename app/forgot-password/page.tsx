'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-xl">KS</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
          <p className="text-muted-foreground">We&apos;ll send you a reset link</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="mt-4"
                >
                  Try another email
                </Button>
              </div>
            )}

            <Link 
              href="/" 
              className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
