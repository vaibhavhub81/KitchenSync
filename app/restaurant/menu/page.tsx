'use client'

import { useState } from 'react'
import { mockRestaurants, MenuItem } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function MenuManagementPage() {
  // For demo, we use the first restaurant's menu
  const [menuItems, setMenuItems] = useState(mockRestaurants[0].menu)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  })

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        description: item.description || ''
      })
    } else {
      setEditingItem(null)
      setFormData({ name: '', price: '', category: '', description: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingItem) {
      setMenuItems(prev => prev.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, price: parseFloat(formData.price) }
          : item
      ))
    } else {
      const newItem: MenuItem = {
        id: `new-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        available: true
      }
      setMenuItems(prev => [...prev, newItem])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ))
  }

  // Group by category
  const categories = [...new Set(menuItems.map(item => item.category))]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your menu items</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Available</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => handleToggleAvailability(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the menu item details' : 'Fill in the details for the new menu item'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Pizza, Drinks"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                {editingItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
