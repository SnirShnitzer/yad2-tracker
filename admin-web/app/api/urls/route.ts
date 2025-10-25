import { NextRequest, NextResponse } from 'next/server'
import { getAllUrls, addUrl } from '../../../lib/db'

export async function GET() {
  try {
    const urls = await getAllUrls()
    return NextResponse.json(urls)
  } catch (error) {
    console.error('Error fetching URLs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, name } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const newUrl = await addUrl(url, name)
    return NextResponse.json(newUrl, { status: 201 })
  } catch (error) {
    console.error('Error adding URL:', error)
    return NextResponse.json(
      { error: 'Failed to add URL' },
      { status: 500 }
    )
  }
}
