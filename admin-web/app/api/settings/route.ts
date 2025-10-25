import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSetting, initializeSettings } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await initializeSettings()
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sendEmails, emailRecipients, adminPassword } = await request.json()
    
    // Update settings
    await updateSetting('send_emails', sendEmails ? 'true' : 'false')
    await updateSetting('email_recipients', emailRecipients || '')
    
    if (adminPassword && adminPassword.trim() !== '') {
      await updateSetting('admin_password', adminPassword)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
