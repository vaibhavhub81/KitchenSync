'use client'

import { mockUsers } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockUsers
    const query = searchQuery.toLowerCase()
    return mockUsers.filter(
      u => u.name.toLowerCase().includes(query) || 
           u.email.toLowerCase().includes(query) ||
           u.role.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Users</h1>
            <p className="text-muted-foreground">Manage all users in the system</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 sm:w-auto w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{user.name}</p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-4 text-muted-foreground">{user.phone}</td>
                      <td className="px-4 py-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${user.role === 'admin' ? 'bg-primary/10 text-primary' : ''}
                          ${user.role === 'restaurant' ? 'bg-emerald-50 text-emerald-700' : ''}
                          ${user.role === 'customer' ? 'bg-blue-50 text-blue-700' : ''}
                        `}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
