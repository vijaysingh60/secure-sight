'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Volume2, Maximize, Camera, RotateCcw, ZoomIn } from 'lucide-react'
import clsx from 'clsx'

const CAMERA_FEEDS = [
  {
    id: 'main-entrance',
    name: 'Main Entrance',
    location: 'Building Main Entry',
    thumbnail: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=400',
    isLive: true,
    status: 'online'
  },
  {
    id: 'vault',
    name: 'Vault Camera',
    location: 'Secure Vault - Level B2',
    thumbnail: 'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400',
    isLive: true,
    status: 'online'
  },
  {
    id: 'shop-floor',
    name: 'Shop Floor A',
    location: 'Manufacturing Area - Zone A',
    thumbnail: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400',
    isLive: true,
    status: 'online'
  }
]

export default function IncidentPlayer({ selectedIncident }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_FEEDS[0])
  const [currentTime, setCurrentTime] = useState('00:00')
  const [duration, setDuration] = useState('02:15')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (selectedIncident) {
      // Find matching camera feed for the incident
      const matchingCamera = CAMERA_FEEDS.find(camera => 
        camera.name.toLowerCase().includes(selectedIncident.cameras?.name.toLowerCase().split(' ')[0] || '')
      )
      if (matchingCamera) {
        setSelectedCamera(matchingCamera)
      }
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime('00:00')
    }
  }, [selectedIncident])

  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setIsPlaying(false)
            return 100
          }
          
          // Update current time based on progress
          const totalSeconds = 135 // 2:15 duration
          const currentSeconds = Math.floor((newProgress / 100) * totalSeconds)
          const minutes = Math.floor(currentSeconds / 60)
          const seconds = currentSeconds % 60
          setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
          
          return newProgress
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setProgress(0)
    setCurrentTime('00:00')
    setIsPlaying(false)
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full max-h-[600px] flex flex-col shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Incident Player</h2>
          <p className="text-sm text-slate-400">
            {selectedIncident ? 
              `${selectedIncident.cameras?.name || selectedCamera.name} - ${selectedIncident.type}` : 
              `${selectedCamera.name} - Live Feed`
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedIncident && (
            <div className="px-3 py-1 bg-red-900/30 border border-red-700 rounded-lg">
              <span className="text-sm text-red-300 font-medium">INCIDENT</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Video Player */}
      <div className="flex-1 bg-black rounded-xl mb-6 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simulated video feed with background image */}
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${selectedCamera.thumbnail})`
            }}
          >
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-20 w-20 text-white/80 mx-auto mb-4 drop-shadow-lg" />
                <p className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                  {selectedCamera.name}
                </p>
                <p className="text-white/80 text-sm mb-4 drop-shadow">
                  {selectedIncident ? 'Incident Playback' : 'Live Feed'}
                </p>
                {selectedIncident && (
                  <div className="mt-6 px-6 py-3 bg-red-900/80 border border-red-600 rounded-xl backdrop-blur-sm">
                    <p className="text-red-200 text-lg font-bold mb-1">
                      {selectedIncident.type}
                    </p>
                    <p className="text-red-300 text-sm">
                      {new Date(selectedIncident.ts_start).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamp overlay */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 rounded-lg backdrop-blur-sm">
              <span className="text-white text-sm font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Recording indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 bg-red-900/70 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-200 text-sm font-medium">REC</span>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
          {/* Progress Bar */}
          {selectedIncident && (
            <div className="mb-4">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedIncident && (
                <>
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <RotateCcw className="h-4 w-4 text-white" />
                  </button>
                </>
              )}
              <Volume2 className="h-5 w-5 text-white" />
              <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full"></div>
              </div>
              {selectedIncident && (
                <span className="text-white text-sm font-mono">
                  {currentTime} / {duration}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm">
                <ZoomIn className="h-4 w-4 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm">
                <Maximize className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Feed Thumbnails */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Camera Feeds</h3>
        <div className="flex space-x-4">
          {CAMERA_FEEDS.map((camera) => (
            <button
              key={camera.id}
              onClick={() => setSelectedCamera(camera)}
              className={clsx(
                "relative flex-1 aspect-video bg-slate-700 rounded-lg overflow-hidden transition-all duration-300 group",
                selectedCamera.id === camera.id 
                  ? "ring-2 ring-blue-500 scale-105 shadow-lg" 
                  : "hover:scale-102 hover:ring-1 hover:ring-slate-500 hover:shadow-md"
              )}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${camera.thumbnail})`
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-white/90 mx-auto mb-2 drop-shadow" />
                    <p className="text-xs text-white font-semibold drop-shadow">{camera.name}</p>
                    <p className="text-xs text-white/70 drop-shadow">{camera.location}</p>
                  </div>
                </div>
              </div>
              
              {camera.isLive && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 bg-red-900/80 rounded backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-200 font-medium">LIVE</span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded backdrop-blur-sm">
                <span className="text-xs text-white/90 font-medium">{camera.status.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}