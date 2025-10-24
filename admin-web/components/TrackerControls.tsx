'use client'

import { useState } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'

export function TrackerControls() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleTriggerTracker = async () => {
    setLoading(true)
    setMessage('')

    try {
      // In a real app, you'd trigger the tracker via API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      setMessage('Tracker triggered successfully! Check the ads page for new results.')
    } catch (error) {
      setMessage('Failed to trigger tracker')
    } finally {
      setLoading(false)
    }
  }

  const handleClearOldAds = async () => {
    if (!confirm('Are you sure you want to clear ads older than 30 days? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // In a real app, you'd call the clear ads API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Old ads cleared successfully!')
    } catch (error) {
      setMessage('Failed to clear old ads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tracker Controls</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Schedule</p>
              <p className="text-sm text-gray-500">Runs every hour automatically</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleTriggerTracker}
            disabled={loading}
            className="btn btn-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? 'Running...' : 'Run Tracker Now'}
          </button>

          <button
            onClick={handleClearOldAds}
            disabled={loading}
            className="btn btn-secondary"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Old Ads
          </button>
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Manual runs are logged and can be monitored in the activity feed</p>
          <p>• Clearing old ads helps maintain database performance</p>
          <p>• The tracker runs automatically via GitHub Actions</p>
        </div>
      </div>
    </div>
  )
}
