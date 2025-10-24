import { Ad } from '@/lib/db'
import { ExternalLink, Calendar } from 'lucide-react'

interface AdTableProps {
  ads: Ad[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export function AdTable({ ads, currentPage, totalPages, totalCount }: AdTableProps) {
  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No ads found</p>
        <p className="text-sm text-gray-400">
          {totalCount === 0 ? 'No ads have been tracked yet' : 'Try adjusting your search'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Address</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map((ad) => (
              <tr key={ad.id}>
                <td className="font-medium text-gray-900 max-w-xs">
                  <div className="truncate" title={ad.title}>
                    {ad.title}
                  </div>
                </td>
                <td className="text-gray-600 font-medium">
                  {ad.price}
                </td>
                <td className="text-gray-600">
                  <div className="truncate max-w-xs" title={ad.address}>
                    {ad.address}
                  </div>
                </td>
                <td>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.description === 'Private'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ad.description || 'Unknown'}
                  </span>
                </td>
                <td className="text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(ad.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-500"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            {currentPage > 1 && (
              <a
                href={`?page=${currentPage - 1}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={`?page=${currentPage + 1}`}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            )}
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * 20 + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 20, totalCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalCount}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {currentPage > 1 && (
                  <a
                    href={`?page=${currentPage - 1}`}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`?page=${page}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </a>
                ))}
                {currentPage < totalPages && (
                  <a
                    href={`?page=${currentPage + 1}`}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </a>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
