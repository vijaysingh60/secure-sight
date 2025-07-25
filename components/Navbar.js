'use client'

import { usePathname } from 'next/navigation'
import { Shield, Video, Users, AlertTriangle, LayoutGrid, UserCircle, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { name: 'Cameras', href: '/cameras', icon: Video },
  { name: 'Scenes', href: '/scenes', icon: Shield },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Users', href: '/users', icon: Users },
]

const USER = {
  name: 'John Doe',
  email: 'john.doe@securesight.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  resolvedIncidents: 4,
}

export default function Navbar() {
  const pathname = usePathname()
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    async function fetchActiveIncidents() {
      try {
        const res = await fetch('/api/incidents?resolved=false')
        if (res.ok) {
          const data = await res.json()
          setActiveCount(data.length)
        }
      } catch (e) {}
    }
    fetchActiveIncidents()
  }, [])

  return (
    <nav className="bg-gradient-to-r from-slate-900/90 to-blue-900/80 backdrop-blur-md border-b border-slate-800 px-8 py-3 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SecureSight</h1>
            <p className="text-xs text-slate-400 font-medium">CCTV Monitoring</p>
          </div>
        </div>
        {/* Nav Links */}
        <div className="flex items-center space-x-2 bg-slate-800/60 px-4 py-2 rounded-2xl shadow border border-slate-700">
          {NAV_LINKS.map(link => {
            const Icon = link.icon
            const isActive = (link.href === '/' && pathname === '/') || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <div
                key={link.name}
                className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150 space-x-2 cursor-default select-none ${isActive ? 'bg-blue-700/80 text-white shadow' : 'text-slate-300'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </div>
            )
          })}
        </div>
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          {/* Active Incidents Badge */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-amber-900/60 border border-amber-700 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-amber-200 font-semibold">{activeCount} active incidents</span>
          </div>
          {/* User Info */}
          <div className="flex items-center space-x-3 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700">
            <img src={USER.avatar} alt="avatar" className="w-9 h-9 rounded-full border-2 border-blue-700 object-cover" />
            <div className="text-right">
              <div className="text-sm text-white font-semibold leading-tight">{USER.name}</div>
              <div className="text-xs text-slate-400">{USER.email}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}