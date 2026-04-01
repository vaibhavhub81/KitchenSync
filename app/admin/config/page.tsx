'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Settings2, Clock, Gauge, Timer } from 'lucide-react'

export default function AdminConfigPage() {
  const { systemConfig, updateSystemConfig, showToast } = useApp()
  
  const [settings, setSettings] = useState({
    siteName: 'KitchenSync',
    supportEmail: 'support@kitchensync.com',
    enableNotifications: true,
    enableKioskMode: true,
    enableAnalytics: true,
    maintenanceMode: false
  })

  const [thresholds, setThresholds] = useState({
    busyThreshold: systemConfig.busyThreshold,
    overloadedThreshold: systemConfig.overloadedThreshold,
    bufferTime: systemConfig.bufferTime,
    acceptanceTimeout: systemConfig.acceptanceTimeout
  })

  useEffect(() => {
    setThresholds({
      busyThreshold: systemConfig.busyThreshold,
      overloadedThreshold: systemConfig.overloadedThreshold,
      bufferTime: systemConfig.bufferTime,
      acceptanceTimeout: systemConfig.acceptanceTimeout
    })
  }, [systemConfig])

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleThresholdChange = (key: keyof typeof thresholds, value: number) => {
    setThresholds(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateSystemConfig(thresholds)
    showToast('Settings saved successfully!', 'success')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Configuration</h1>
            <p className="text-muted-foreground">Manage system-wide settings</p>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Queue System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Load Thresholds
            </CardTitle>
            <CardDescription>Configure when restaurants show as busy or overloaded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="busyThreshold">Busy Threshold (%)</Label>
                  <span className="text-sm text-muted-foreground">{thresholds.busyThreshold}%</span>
                </div>
                <Input
                  id="busyThreshold"
                  type="range"
                  min="30"
                  max="80"
                  value={thresholds.busyThreshold}
                  onChange={e => handleThresholdChange('busyThreshold', Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Restaurant shows as &quot;Busy&quot; when workload exceeds this percentage
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="overloadedThreshold">Overloaded Threshold (%)</Label>
                  <span className="text-sm text-muted-foreground">{thresholds.overloadedThreshold}%</span>
                </div>
                <Input
                  id="overloadedThreshold"
                  type="range"
                  min="60"
                  max="100"
                  value={thresholds.overloadedThreshold}
                  onChange={e => handleThresholdChange('overloadedThreshold', Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Restaurant shows as &quot;Overloaded&quot; when workload exceeds this percentage
                </p>
              </div>
            </div>

            {/* Visual threshold preview */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-medium mb-3">Threshold Preview</p>
              <div className="h-6 bg-muted rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${thresholds.busyThreshold}%` }}
                />
                <div 
                  className="bg-amber-500 transition-all"
                  style={{ width: `${thresholds.overloadedThreshold - thresholds.busyThreshold}%` }}
                />
                <div 
                  className="bg-red-500 flex-1"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Normal (0-{thresholds.busyThreshold}%)</span>
                <span>Busy ({thresholds.busyThreshold}-{thresholds.overloadedThreshold}%)</span>
                <span>Overloaded ({thresholds.overloadedThreshold}%+)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Timing Settings
            </CardTitle>
            <CardDescription>Configure time-related system behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
                <Input
                  id="bufferTime"
                  type="number"
                  min="1"
                  max="10"
                  value={thresholds.bufferTime}
                  onChange={e => handleThresholdChange('bufferTime', Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Added to wait time estimates</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptanceTimeout">Acceptance Timeout (minutes)</Label>
                <Input
                  id="acceptanceTimeout"
                  type="number"
                  min="5"
                  max="30"
                  value={thresholds.acceptanceTimeout}
                  onChange={e => handleThresholdChange('acceptanceTimeout', Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Auto-cancel orders after this time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>Basic configuration for the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={e => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={e => handleSettingChange('supportEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Enable or disable platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Send notifications for order updates</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={v => handleSettingChange('enableNotifications', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Kiosk Mode</p>
                <p className="text-sm text-muted-foreground">Allow restaurants to use kiosk ordering</p>
              </div>
              <Switch
                checked={settings.enableKioskMode}
                onCheckedChange={v => handleSettingChange('enableKioskMode', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Analytics</p>
                <p className="text-sm text-muted-foreground">Collect usage analytics data</p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={v => handleSettingChange('enableAnalytics', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable the platform</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={v => handleSettingChange('maintenanceMode', v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
