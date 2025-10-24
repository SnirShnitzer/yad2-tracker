'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - in a real app, you'd fetch this from your database
const data = [
  { date: '2024-01-01', ads: 12 },
  { date: '2024-01-02', ads: 8 },
  { date: '2024-01-03', ads: 15 },
  { date: '2024-01-04', ads: 22 },
  { date: '2024-01-05', ads: 18 },
  { date: '2024-01-06', ads: 25 },
  { date: '2024-01-07', ads: 30 },
]

export function StatsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [value, 'Ads Found']}
          />
          <Line 
            type="monotone" 
            dataKey="ads" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
