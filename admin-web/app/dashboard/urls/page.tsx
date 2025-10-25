'use client'

import { useState, useEffect } from 'react'
import { UrlTable } from '../../../components/UrlTable'
import { UrlForm } from '../../../components/UrlForm'
import { Plus } from 'lucide-react'
import { Url } from '../../../lib/db'

export default function UrlsPage() {
  const [urls, setUrls] = useState<Url[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls')
      if (response.ok) {
        const data = await response.json()
        setUrls(data)
      }
    } catch (error) {
      console.error('Error fetching URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUrl = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    fetchUrls() // Refresh the list
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">URL Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage the Yad2 API URLs that the tracker monitors
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleAddUrl}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </button>
        </div>
      </div>

      <div className="card">
        <UrlTable urls={urls} />
      </div>

      {showForm && (
        <UrlForm onClose={handleCloseForm} />
      )}
    </div>
  )
}
