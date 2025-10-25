import { getAds } from '../lib/db'
import { Clock, ExternalLink } from 'lucide-react'

export async function ActivityFeed() {
  const recentAds = await getAds(10, 0)

  if (recentAds.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {recentAds.map((ad, index) => (
          <li key={ad.id}>
            <div className="relative pb-8">
              {index !== recentAds.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                    <Clock className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      New ad found: <span className="font-medium text-gray-900">{ad.title}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {ad.price} • {ad.address}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={ad.created_at}>
                      {new Date(ad.created_at).toLocaleDateString()}
                    </time>
                    <div className="mt-1">
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
