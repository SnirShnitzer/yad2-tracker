import { getAllUrls } from '@/lib/db'
import { UrlTable } from '@/components/UrlTable'
import { UrlForm } from '@/components/UrlForm'
import { Plus } from 'lucide-react'

export default async function UrlsPage() {
  const urls = await getAllUrls()

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
          <UrlForm />
        </div>
      </div>

      <div className="card">
        <UrlTable urls={urls} />
      </div>
    </div>
  )
}
