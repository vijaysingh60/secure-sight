'use client'

import { Shield, Activity, AlertTriangle, Users, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [activeCount, setActiveCount] = useState(0)
  const [cameraCount, setCameraCount] = useState(3) // Default, can be made dynamic

  useEffect(() => {
    async function fetchActiveIncidents() {
      try {
        const res = await fetch('/api/incidents?resolved=false')
        if (res.ok) {
          const data = await res.json()
          setActiveCount(data.length)
        }
      } catch (e) {
        // fallback: do nothing
      }
    }
    fetchActiveIncidents()
  }, [])

  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SecureSight</h1>
            <p className="text-sm text-slate-400 font-medium">CCTV Monitoring Dashboard</p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-300 font-medium">System Online</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-2 bg-amber-900/30 border border-amber-700 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">{activeCount} Active Incidents</span>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-300">{cameraCount} Cameras</span>
          </div>
          
          {/* Current Time */}
          <div className="text-right">
            <div className="text-sm text-slate-300 font-medium">{currentTime}</div>
            <div className="text-xs text-slate-500">Local Time</div>
          </div>
          
          {/* Settings */}
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}