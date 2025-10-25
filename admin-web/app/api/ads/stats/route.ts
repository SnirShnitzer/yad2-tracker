import { NextResponse } from 'next/server'
import { getAdsStats } from '../../../../lib/db'

export async function GET() {
  try {
    const stats = await getAdsStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
