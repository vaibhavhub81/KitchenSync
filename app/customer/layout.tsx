'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Navbar } from '@/components/navbar'
import { ToastContainer } from '@/components/toast-container'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else if (user.role !== 'customer') {
      router.push(`/${user.role}`)
    }
  }, [user, router])

  if (!user || user.role !== 'customer') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <ToastContainer />
    </div>
  )
}
