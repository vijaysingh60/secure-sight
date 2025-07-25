'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Eye, Clock, MapPin, CheckCircle, XCircle, User, Zap } from 'lucide-react'
import clsx from 'clsx'

const INCIDENT_ICONS = {
  'Gun Threat': { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  'Unauthorised Access': { icon: Eye, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  'Face Recognised': { icon: User, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
}

export default function IncidentList({ onIncidentSelect, selectedIncident }) {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [resolvingIds, setResolvingIds] = useState(new Set())
  const [filter, setFilter] = useState('all') // all, unresolved, resolved

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/incidents')
      if (response.ok) {
        const data = await response.json()
        setIncidents(data)
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  const handleResolveIncident = async (incidentId, event) => {
    event.stopPropagation()
    setResolvingIds(prev => new Set([...prev, incidentId]))
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      })
      if (response.ok) {
        await fetchIncidents()
      }
    } catch (error) {
      console.error('Failed to resolve incident:', error)
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(incidentId)
        return newSet
      })
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const formatDuration = (start, end) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diffInSeconds = Math.floor((endTime - startTime) / 1000)
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`
    } else {
      return `${Math.floor(diffInSeconds / 60)}m ${diffInSeconds % 60}s`
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'unresolved') return !incident.resolved
    if (filter === 'resolved') return incident.resolved
    return true
  })

  const activeIncidentsCount = incidents.filter(i => !i.resolved).length

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 h-full shadow-xl border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full flex flex-col shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Incidents</h2>
          <p className="text-sm text-slate-400">
            {activeIncidentsCount} active • {incidents.length - activeIncidentsCount} resolved
          </p>
        </div>
        <div className="flex bg-slate-700 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: incidents.length },
            { key: 'unresolved', label: 'Active', count: activeIncidentsCount },
            { key: 'resolved', label: 'Resolved', count: incidents.length - activeIncidentsCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={clsx(
                "px-3 py-2 text-xs font-medium rounded transition-all duration-200 relative",
                filter === tab.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-600"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={clsx(
                  "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                  filter === tab.key
                    ? "bg-blue-500 text-white"
                    : "bg-slate-600 text-slate-300"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-h-[500px] overflow-y-auto space-y-3 pr-2">
        {filteredIncidents.map((incident) => {
          const IconComponent = INCIDENT_ICONS[incident.type]?.icon || AlertTriangle
          const iconColor = INCIDENT_ICONS[incident.type]?.color || 'text-red-500'
          const iconBg = INCIDENT_ICONS[incident.type]?.bg || 'bg-red-500/10'
          const iconBorder = INCIDENT_ICONS[incident.type]?.border || 'border-red-500/20'
          const isResolving = resolvingIds.has(incident.id)
          const isSelected = selectedIncident?.id === incident.id

          return (
            <div
              key={incident.id}
              onClick={() => onIncidentSelect(incident)}
              className={clsx(
                "border rounded-xl p-4 cursor-pointer transition-all duration-300 incident-card",
                isSelected
                  ? "bg-blue-600/10 border-blue-500 shadow-lg ring-1 ring-blue-500/20"
                  : incident.resolved 
                    ? "bg-slate-700/30 border-slate-600 incident-resolved hover:bg-slate-700/50" 
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:shadow-lg",
                isResolving && "opacity-50 cursor-wait"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  iconBg, iconBorder,
                  incident.resolved && "grayscale opacity-60"
                )}>
                  <IconComponent className={clsx("h-6 w-6", iconColor)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={clsx(
                      "font-semibold text-sm",
                      incident.resolved ? "text-slate-400" : "text-white"
                    )}>
                      {incident.type}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!incident.resolved && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      <span className={clsx(
                        "text-xs font-medium",
                        incident.resolved ? "text-slate-500" : "text-slate-400"
                      )}>
                        {formatTimeAgo(incident.ts_start)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className={clsx(
                      "h-3 w-3 flex-shrink-0",
                      incident.resolved ? "text-slate-500" : "text-slate-400"
                    )} />
                    <span className={clsx(
                      "text-xs truncate",
                      incident.resolved ? "text-slate-500" : "text-slate-400"
                    )}>
                      {incident.camera_location}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className={clsx(
                        "h-3 w-3",
                        incident.resolved ? "text-slate-500" : "text-slate-400"
                      )} />
                      <span className={clsx(
                        "text-xs",
                        incident.resolved ? "text-slate-500" : "text-slate-400"
                      )}>
                        {formatDuration(incident.ts_start, incident.ts_end)}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => handleResolveIncident(incident.id, e)}
                      disabled={isResolving}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center space-x-1",
                        incident.resolved
                          ? "bg-green-600/20 text-green-400 cursor-default border border-green-600/30"
                          : "bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-md",
                        isResolving && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isResolving ? (
                        <>
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : incident.resolved ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Resolved</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3" />
                          <span>Resolve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium mb-2">No incidents found</p>
            <p className="text-slate-500 text-sm">
              {filter === 'unresolved' 
                ? 'All incidents have been resolved' 
                : filter === 'resolved'
                ? 'No resolved incidents yet'
                : 'Check back later for updates'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}