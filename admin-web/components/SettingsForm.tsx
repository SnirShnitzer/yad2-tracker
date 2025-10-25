'use client'

import { useState, useEffect } from 'react'
import { Save, Mail, Bell } from 'lucide-react'

export function SettingsForm() {
  const [formData, setFormData] = useState({
    sendEmails: true,
    emailRecipients: '',
    adminPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const settings = await response.json()
        setFormData({
          sendEmails: settings.send_emails === 'true',
          emailRecipients: settings.email_recipients || '',
          adminPassword: '',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setFormData(prev => ({ ...prev, adminPassword: '' })) // Clear password field
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to save settings')
      }
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            id="sendEmails"
            type="checkbox"
            checked={formData.sendEmails}
            onChange={(e) => setFormData({ ...formData, sendEmails: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="sendEmails" className="ml-2 block text-sm text-gray-900">
            Send email notifications for new ads
          </label>
        </div>

        {formData.sendEmails && (
          <div>
            <label htmlFor="emailRecipients" className="block text-sm font-medium text-gray-700">
              Email Recipients
            </label>
            <input
              type="text"
              id="emailRecipients"
              className="input mt-1"
              placeholder="email1@gmail.com, email2@gmail.com"
              value={formData.emailRecipients}
              onChange={(e) => setFormData({ ...formData, emailRecipients: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple email addresses with commas
            </p>
          </div>
        )}

        <div>
          <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
            Change Admin Password
          </label>
          <input
            type="password"
            id="adminPassword"
            className="input mt-1"
            placeholder="Leave blank to keep current password"
            value={formData.adminPassword}
            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
