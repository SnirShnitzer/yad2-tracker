import { getAds, getAdsCount } from '../../../lib/db'
import { AdTable } from '../../../components/AdTable'
import { SearchBar } from '../../../components/SearchBar'

export const dynamic = 'force-dynamic'

interface AdsPageProps {
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function AdsPage({ searchParams }: AdsPageProps) {
  const search = searchParams.search || ''
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [ads, totalCount] = await Promise.all([
    getAds(limit, offset, search),
    getAdsCount(search)
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Ads History</h1>
          <p className="mt-2 text-sm text-gray-700">
            View all ads that have been tracked by the system
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <SearchBar placeholder="Search ads by title or address..." />
        </div>
        
        <AdTable 
          ads={ads} 
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}
