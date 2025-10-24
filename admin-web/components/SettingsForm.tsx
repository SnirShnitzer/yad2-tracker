'use client'

import { useState } from 'react'
import { Save, Mail, Bell } from 'lucide-react'

export function SettingsForm() {
  const [formData, setFormData] = useState({
    sendEmails: true,
    emailRecipients: '',
    adminPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // In a real app, you'd make API calls to update settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Settings saved successfully!')
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setLoading(false)
    }
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
