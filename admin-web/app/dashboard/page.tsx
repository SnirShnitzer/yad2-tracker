import { getAdsStats } from '@/lib/db'
import { StatsCard } from '@/components/StatsCard'
import { ActivityFeed } from '@/components/ActivityFeed'

export default async function DashboardPage() {
  const stats = await getAdsStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your Yad2 tracker performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total URLs"
          value={stats.totalUrls}
          subtitle={`${stats.activeUrls} active`}
          icon="Link"
        />
        <StatsCard
          title="Total Ads"
          value={stats.totalAds}
          subtitle="All time"
          icon="FileText"
        />
        <StatsCard
          title="Ads Today"
          value={stats.adsToday}
          subtitle="New listings found"
          icon="Calendar"
        />
        <StatsCard
          title="This Week"
          value={stats.adsThisWeek}
          subtitle="Last 7 days"
          icon="TrendingUp"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/urls"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Manage URLs
            </a>
            <a
              href="/dashboard/ads"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              View Recent Ads
            </a>
            <a
              href="/dashboard/settings"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Settings
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tracker</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Schedule</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Hourly
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <ActivityFeed />
      </div>
    </div>
  )
}
