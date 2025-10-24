import { NextRequest, NextResponse } from 'next/server'
import { updateUrl, deleteUrl } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const updates = await request.json()
    
    const updatedUrl = await updateUrl(id, updates)
    return NextResponse.json(updatedUrl)
  } catch (error) {
    console.error('Error updating URL:', error)
    return NextResponse.json(
      { error: 'Failed to update URL' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await deleteUrl(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting URL:', error)
    return NextResponse.json(
      { error: 'Failed to delete URL' },
      { status: 500 }
    )
  }
}
