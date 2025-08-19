import { motion } from 'framer-motion'
import { Trophy, Target, TrendingUp, Award, Calendar, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { courseAPI } from '../services/api'
import { useState, useEffect } from 'react'

const Profile = () => {
  const { user } = useAuth()
  const { progress, getTotalProgress } = useProgress()
  const totalProgress = getTotalProgress()

  const achievements = [
    { id: 1, name: 'Первый шаг', description: 'Завершил первую тему', icon: Star, unlocked: true },
    { id: 2, name: 'Настойчивость', description: 'Завершил 5 тем подряд', icon: Target, unlocked: false },
    { id: 3, name: 'Отличник', description: 'Получил 100% в теме', icon: Trophy, unlocked: false },
    { id: 4, name: 'Скорость', description: 'Завершил уровень за день', icon: TrendingUp, unlocked: false },
    { id: 5, name: 'Мастер', description: 'Достиг уровня B1', icon: Award, unlocked: false },
  ]

  const recentActivity = [
    { date: '2024-01-15', action: 'Завершил тему "Present Simple"', level: 'A1', score: 85 },
    { date: '2024-01-14', action: 'Завершил тему "Базовые приветствия"', level: 'A0', score: 100 },
    { date: '2024-01-13', action: 'Завершил тему "Числа от 1 до 10"', level: 'A0', score: 90 },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Заголовок профиля */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              Уровень: {user?.level}
            </span>
            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
              {user?.points} очков
            </span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-gray-600">Завершенных тем</div>
          </motion.div>

          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{totalProgress}%</div>
            <div className="text-gray-600">Общий прогресс</div>
          </motion.div>

          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{user?.points}</div>
            <div className="text-gray-600">Заработанных очков</div>
          </motion.div>

          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-gray-600">Достижений</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Прогресс по уровням */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Прогресс по уровням</h2>
            <div className="space-y-4">
              {courseData.map((level, index) => {
                const levelProgress = progress.find(p => p.levelId === level.id)
                const completedTopics = levelProgress?.topics.filter(t => t.completed).length || 0
                const totalTopics = level.topics.length
                const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

                return (
                  <div key={level.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: level.color }}
                        >
                          {level.id}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{level.name}</h3>
                          <p className="text-sm text-gray-500">{completedTopics}/{totalTopics} тем</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: level.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.1 * index }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Достижения */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Достижения</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                      achievement.unlocked 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Недавняя активность */}
        <motion.div
          className="card mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Недавняя активность</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {activity.level}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{activity.score} очков</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Profile
