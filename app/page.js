'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import IncidentPlayer from '../components/IncidentPlayer'
import IncidentList from '../components/IncidentList'

export default function Dashboard() {
  const [selectedIncident, setSelectedIncident] = useState(null)

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Incident Player - Left Side (2/3 width) */}
          <div className="lg:col-span-2">
            <IncidentPlayer selectedIncident={selectedIncident} />
          </div>
          
          {/* Incident List - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <IncidentList 
              onIncidentSelect={setSelectedIncident}
              selectedIncident={selectedIncident}
            />
          </div>
        </div>
      </div>
    </div>
  )
}