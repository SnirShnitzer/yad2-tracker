import { 
  Link, 
  FileText, 
  Calendar, 
  TrendingUp,
  BarChart3,
  Settings,
  Users
} from 'lucide-react'

const iconMap = {
  Link,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Users,
}

interface StatsCardProps {
  title: string
  value: number
  subtitle: string
  icon: keyof typeof iconMap
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  const Icon = iconMap[icon]

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value.toLocaleString()}
              </div>
              <div className="ml-2 text-sm text-gray-500">
                {subtitle}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
