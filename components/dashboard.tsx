"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, UserSquare2, FolderKanban, BarChart2, Settings, Sun, Moon, LogOut } from 'lucide-react'
import Overview from '@/components/overview'
import Clients from '@/components/clients'
import Projects from '@/components/projects'
import Statistics from '@/components/statistics'
import SettingsScreen from '@/components/settings'
import Auth from '@/components/auth'
import { useTheme } from "next-themes"
import { useGlobalState } from '@/contexts/GlobalStateContext'

export default function Dashboard() {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { currentUser, login, logout } = useGlobalState()

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Overview />
      case 'clients':
        return <Clients />
      case 'projects':
        return <Projects />
      case 'statistics':
        return <Statistics />
      case 'settings':
        return <SettingsScreen />
      default:
        return <Overview />
    }
  }

  if (!mounted) {
    return null
  }

  if (!currentUser) {
    return <Auth onLogin={login} />
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-16 bg-card shadow-md border-r border-border flex flex-col justify-between">
        <nav className="flex flex-col items-center py-4">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('dashboard')}
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('clients')}
          >
            <UserSquare2 className="h-6 w-6" />
            <span className="sr-only">Clients</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('projects')}
          >
            <FolderKanban className="h-6 w-6" />
            <span className="sr-only">Projects</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('statistics')}
          >
            <BarChart2 className="h-6 w-6" />
            <span className="sr-only">Statistics</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setCurrentScreen('settings')}
          >
            <Settings className="h-6 w-6" />
            <span className="sr-only">Settings</span>
          </Button>
        </nav>
        <div className="flex flex-col items-center pb-4 space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
          >
            <LogOut className="h-6 w-6" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto flex justify-center">
        <div className="w-full max-w-7xl">
          {renderScreen()}
        </div>
      </main>
    </div>
  )
}