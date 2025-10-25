'use client'

import { useState } from 'react'
import { Url } from '../lib/db'
import { Edit, Trash2, Power, PowerOff } from 'lucide-react'
import { UrlForm } from './UrlForm'

interface UrlTableProps {
  urls: Url[]
}

export function UrlTable({ urls }: UrlTableProps) {
  const [editingUrl, setEditingUrl] = useState<Url | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<Url | null>(null)

  const handleEdit = (url: Url) => {
    setEditingUrl(url)
  }

  const handleDelete = async (url: Url) => {
    if (!confirm(`Are you sure you want to delete "${url.name || url.url}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/urls/${url.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete URL')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete URL')
    }
  }

  const handleToggleStatus = async (url: Url) => {
    try {
      const response = await fetch(`/api/urls/${url.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !url.is_active,
        }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to update URL status')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update URL status')
    }
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No URLs configured</p>
        <p className="text-sm text-gray-400">Add your first URL to start tracking</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.map((url) => (
              <tr key={url.id}>
                <td className="font-medium text-gray-900">
                  {url.name || 'Unnamed URL'}
                </td>
                <td className="text-gray-600">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {url.url.length > 50 ? `${url.url.substring(0, 50)}...` : url.url}
                  </code>
                </td>
                <td>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      url.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {url.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-gray-500">
                  {new Date(url.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(url)}
                      className="text-primary-600 hover:text-primary-500"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(url)}
                      className={`${
                        url.is_active
                          ? 'text-red-600 hover:text-red-500'
                          : 'text-green-600 hover:text-green-500'
                      }`}
                      title={url.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {url.is_active ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(url)}
                      className="text-red-600 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUrl && (
        <UrlForm
          url={editingUrl}
          onClose={() => setEditingUrl(null)}
        />
      )}
    </div>
  )
}
