import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Trophy, 
  User, 
  LogOut, 
  Menu, 
  BarChart3, 
  Home, 
  Settings,
  Crown,
  ChevronDown,
  X,
  Users
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Simplified navigation items
  const mainNavItems = [
    { to: '/', label: 'Главная', icon: Home },
    { to: '/levels', label: 'Курсы', icon: BookOpen },
    { to: '/profile', label: 'Прогресс', icon: BarChart3 },
    { to: '/leaderboard', label: 'Друзья', icon: Users },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A0': 'bg-blue-100 text-blue-700',
      'A1': 'bg-green-100 text-green-700',
      'A2': 'bg-yellow-100 text-yellow-700',
      'B1': 'bg-orange-100 text-orange-700',
      'B2': 'bg-red-100 text-red-700',
      'C1': 'bg-purple-100 text-purple-700',
      'C2': 'bg-indigo-100 text-indigo-700'
    }
    return colors[level] || 'bg-gray-100 text-gray-700'
  }

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="navbar">
      <div className="container">
        <div className="flex justify-between items-center h-full">
          {/* Logo and title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-text group-hover:text-primary transition-colors">
                EnglishPro
              </span>
              <span className="text-xs text-muted -mt-1">Изучайте английский</span>
            </div>
          </Link>

          {/* Main navigation for desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link 
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side - user profile */}
          <div className="flex items-center space-x-4">
            {/* XP and Level */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="xp-chip">
                <span className="font-medium">{user?.points || 0} XP</span>
              </div>
              <div className={`level-badge ${getLevelColor(user?.level || 'A0')}`}>
                {user?.level || 'A0'}
              </div>
            </div>

            {/* User profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-text">{user?.name || 'Пользователь'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile dropdown menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-medium text-text">{user?.name}</div>
                      <div className="text-sm text-muted">{user?.email}</div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-text hover:bg-muted transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Профиль</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-text hover:bg-muted transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Настройки</span>
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-text hover:bg-muted transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Crown className="w-4 h-4" />
                          <span>Админ панель</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-border pt-2">
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileMenuOpen(false)
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-border py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container">
              <nav className="space-y-2">
                {mainNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
