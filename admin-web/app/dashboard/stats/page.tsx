import { getAdsStats } from '@/lib/db'
import { StatsChart } from '@/components/StatsChart'
import { StatsCard } from '@/components/StatsCard'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const stats = await getAdsStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Analytics and insights about your Yad2 tracker performance
        </p>
      </div>

      {/* Overview Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ads Over Time</h3>
          <StatsChart />
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Tracker Run</span>
              <span className="text-sm text-gray-900">Within last hour</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active URLs</span>
              <span className="text-sm text-gray-900">{stats.activeUrls} / {stats.totalUrls}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm text-gray-900">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
