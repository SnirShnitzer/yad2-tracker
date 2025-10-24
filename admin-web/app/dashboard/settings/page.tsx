'use client'

import { useState } from 'react'
import { SettingsForm } from '@/components/SettingsForm'
import { TrackerControls } from '@/components/TrackerControls'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure your Yad2 tracker settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <SettingsForm />
        <TrackerControls />
      </div>
    </div>
  )
}
