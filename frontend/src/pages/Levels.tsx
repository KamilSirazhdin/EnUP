import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Lock, Play, ArrowRight, BookOpen, Users, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useState, useEffect } from 'react'
import { courseAPI } from '../services/api'

interface Level {
  id: string
  name: string
  title: string
  description: string
  order: number
  is_active: boolean
}

const Levels = () => {
  const { user } = useAuth()
  const { getTotalProgress } = useProgress()
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await courseAPI.getLevels()
        setLevels(response.data)
      } catch (error) {
        console.error('Error fetching levels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  const getLevelColor = (levelName: string) => {
    const colors = {
      'A0': '#3B82F6', // blue
      'A1': '#10B981', // green
      'A2': '#F59E0B', // yellow
      'B1': '#EF4444', // red
      'B2': '#8B5CF6', // purple
      'C1': '#EC4899', // pink
      'C2': '#6366F1', // indigo
    }
    return colors[levelName as keyof typeof colors] || '#6B7280'
  }

  const getLevelIcon = (levelName: string) => {
    const icons = {
      'A0': '🎯',
      'A1': '📚',
      'A2': '🌟',
      'B1': '🔥',
      'B2': '💎',
      'C1': '👑',
      'C2': '🏆',
    }
    return icons[levelName as keyof typeof icons] || '📖'
  }

  const isLevelUnlocked = (levelOrder: number): boolean => {
    // A0 всегда открыт, остальные требуют завершения предыдущего уровня
    return levelOrder === 1 || (user && user.level !== 'A0')
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка уровней...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Уровни обучения</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите уровень для изучения. Каждый уровень открывается после завершения предыдущего.
          </p>
          {user && (
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Ваш уровень:</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {user.level}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Общий прогресс:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {getTotalProgress()}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level.order)
            const levelColor = getLevelColor(level.name)
            const levelIcon = getLevelIcon(level.name)

            return (
              <motion.div
                key={level.id}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Цветная полоса */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: levelColor }}
                />

                {/* Статус уровня */}
                <div className="absolute top-4 right-4">
                  {isUnlocked ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Содержимое карточки */}
                <div className="p-6">
                  {/* Заголовок уровня */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                      style={{ backgroundColor: levelColor }}
                    >
                      {levelIcon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{level.name}</h3>
                      <p className="text-lg font-medium text-gray-700">{level.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{level.description}</p>

                  {/* Индикаторы */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">3 темы</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">1.2k</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">100 очков</span>
                    </div>
                  </div>

                  {/* Кнопка действия */}
                  <div className="flex justify-between items-center">
                    {isUnlocked ? (
                      <Link
                        to={`/levels/${level.id}`}
                        className="group/btn flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <span>Начать обучение</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Заблокировано</span>
                      </button>
                    )}

                    {level.order > 1 && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        Требуется: {levels[level.order - 2]?.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover эффект */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </div>

        {/* Информация о системе уровней */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Как работает система уровней?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Play className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Последовательность</h3>
              <p className="text-gray-600 leading-relaxed">
                Каждый уровень открывается только после завершения предыдущего, обеспечивая систематическое обучение
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Прогресс</h3>
              <p className="text-gray-600 leading-relaxed">
                Отслеживайте свой прогресс по каждой теме и уровню с детальной статистикой
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <ArrowRight className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Развитие</h3>
              <p className="text-gray-600 leading-relaxed">
                Постепенно повышайте свой уровень от A0 до C2, следуя международным стандартам CEFR
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Levels
