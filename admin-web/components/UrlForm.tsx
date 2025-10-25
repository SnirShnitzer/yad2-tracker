'use client'

import { useState } from 'react'
import { Url } from '../lib/db'
import { X } from 'lucide-react'

interface UrlFormProps {
  url?: Url
  onClose?: () => void
}

export function UrlForm({ url, onClose }: UrlFormProps) {
  const [formData, setFormData] = useState({
    url: url?.url || '',
    name: url?.name || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = url
        ? await fetch(`/api/urls/${url.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
        : await fetch('/api/urls', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })

      if (response.ok) {
        window.location.reload()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save URL')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {url ? 'Edit URL' : 'Add New URL'}
                </h3>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input mt-1"
                    placeholder="e.g., Tel Aviv Rentals"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Yad2 API URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    required
                    className="input mt-1"
                    placeholder="https://gw.yad2.co.il/realestate-feed/rent/map?..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The full Yad2 API endpoint URL with your search parameters
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full sm:w-auto sm:ml-3"
              >
                {loading ? 'Saving...' : (url ? 'Update' : 'Add')}
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
