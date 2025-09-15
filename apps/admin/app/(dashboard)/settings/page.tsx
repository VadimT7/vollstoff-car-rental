'use client'

import { useState } from 'react'
import { 
  Settings,
  Store,
  Globe,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Key,
  Save,
  Building
} from 'lucide-react'
import { Button, Card, Input, Label } from '@valore/ui'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'business' | 'notifications' | 'security'>('general')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-2">Manage your application settings and preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          leftIcon={<Save className="h-4 w-4" />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'business', label: 'Business', icon: Building },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="FlyRentals" />
              </div>
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" defaultValue="https://flyrentals.com" />
              </div>
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" defaultValue="flyrentalsca@gmail.com" />
              </div>
              <div>
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" defaultValue="+1 (438) 680-3936" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Business Address</Label>
                <textarea
                  id="address"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  defaultValue="123 Luxury Drive, Beverly Hills, CA 90210"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Regional Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select id="currency" className="w-full px-3 py-2 border rounded-lg">
                  <option value="EUR">EUR ($)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select id="timezone" className="w-full px-3 py-2 border rounded-lg">
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New York</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Default Language</Label>
                <select id="language" className="w-full px-3 py-2 border rounded-lg">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <select id="dateFormat" className="w-full px-3 py-2 border rounded-lg">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Business Settings */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Rental Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minAge">Minimum Rental Age</Label>
                <Input id="minAge" type="number" defaultValue="25" />
              </div>
              <div>
                <Label htmlFor="minDays">Minimum Rental Days</Label>
                <Input id="minDays" type="number" defaultValue="1" />
              </div>
              <div>
                <Label htmlFor="maxDays">Maximum Rental Days</Label>
                <Input id="maxDays" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="cancelHours">Cancellation Notice (hours)</Label>
                <Input id="cancelHours" type="number" defaultValue="48" />
              </div>
              <div>
                <Label htmlFor="depositPercent">Security Deposit (%)</Label>
                <Input id="depositPercent" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="lateFee">Late Return Fee (per hour)</Label>
                <Input id="lateFee" type="number" defaultValue="50" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Payment Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Accept Credit Cards</p>
                  <p className="text-sm text-neutral-600">Enable credit card payments via Stripe</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Accept Cash</p>
                  <p className="text-sm text-neutral-600">Allow cash payments with card hold</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Accept Bank Transfer</p>
                  <p className="text-sm text-neutral-600">Enable bank transfer payments</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">New Booking</p>
                  <p className="text-sm text-neutral-600">Receive email when new booking is made</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Booking Cancellation</p>
                  <p className="text-sm text-neutral-600">Receive email when booking is cancelled</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Payment Received</p>
                  <p className="text-sm text-neutral-600">Receive email when payment is processed</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Daily Summary</p>
                  <p className="text-sm text-neutral-600">Receive daily summary of activities</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Customer Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Booking Confirmation</p>
                  <p className="text-sm text-neutral-600">Send confirmation email to customers</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Pickup Reminder</p>
                  <p className="text-sm text-neutral-600">Send reminder 24 hours before pickup</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Return Reminder</p>
                  <p className="text-sm text-neutral-600">Send reminder 24 hours before return</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">API Keys</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                <Input id="stripeKey" type="password" defaultValue="pk_test_••••••••••••••••" />
              </div>
              <div>
                <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                <Input id="stripeSecret" type="password" defaultValue="sk_test_••••••••••••••••" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-600">Require 2FA for admin accounts</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Session Timeout</p>
                  <p className="text-sm text-neutral-600">Auto logout after 30 minutes of inactivity</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">IP Whitelist</p>
                  <p className="text-sm text-neutral-600">Restrict admin access to specific IPs</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

