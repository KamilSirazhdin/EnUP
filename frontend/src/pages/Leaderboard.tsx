import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Users, TrendingUp, Target, Star, Award, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { leaderboardAPI } from '../services/api'

interface LeaderboardUser {
  user_id: string
  name: string
  email: string
  level: string
  points: number
  topics_completed: number
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await leaderboardAPI.getLeaderboard()
        setLeaderboardData(response.data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        // Fallback to mock data if API fails
        setLeaderboardData([
          { user_id: '1', name: 'Алексей Петров', email: 'alex@example.com', level: 'B1', points: 2840, topics_completed: 15 },
          { user_id: '2', name: 'Мария Сидорова', email: 'maria@example.com', level: 'A2', points: 2650, topics_completed: 12 },
          { user_id: '3', name: 'Дмитрий Козлов', email: 'dmitry@example.com', level: 'B2', points: 2420, topics_completed: 18 },
          { user_id: '4', name: 'Анна Волкова', email: 'anna@example.com', level: 'A1', points: 2180, topics_completed: 8 },
          { user_id: '5', name: 'Сергей Морозов', email: 'sergey@example.com', level: 'A2', points: 1950, topics_completed: 11 },
          { user_id: '6', name: 'Елена Соколова', email: 'elena@example.com', level: 'A0', points: 1680, topics_completed: 6 },
          { user_id: '7', name: 'Игорь Лебедев', email: 'igor@example.com', level: 'A1', points: 1420, topics_completed: 7 },
          { user_id: '8', name: 'Ольга Новикова', email: 'olga@example.com', level: 'A0', points: 1250, topics_completed: 5 },
          { user_id: '9', name: 'Павел Смирнов', email: 'pavel@example.com', level: 'A1', points: 980, topics_completed: 4 },
          { user_id: '10', name: 'Наталья Иванова', email: 'natalia@example.com', level: 'A0', points: 750, topics_completed: 3 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700'
      default:
        return 'bg-gray-100'
    }
  }

  const getLevelColor = (level: string) => {
    const colors = {
      'A0': 'bg-blue-100 text-blue-700',
      'A1': 'bg-green-100 text-green-700',
      'A2': 'bg-yellow-100 text-yellow-700',
      'B1': 'bg-red-100 text-red-700',
      'B2': 'bg-purple-100 text-purple-700',
      'C1': 'bg-pink-100 text-pink-700',
      'C2': 'bg-indigo-100 text-indigo-700',
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getLevelIcon = (level: string) => {
    const icons = {
      'A0': '🎯',
      'A1': '📚',
      'A2': '🌟',
      'B1': '🔥',
      'B2': '💎',
      'C1': '👑',
      'C2': '🏆',
    }
    return icons[level as keyof typeof icons] || '📖'
  }

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка рейтинга...</p>
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
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Таблица лидеров</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Соревнуйтесь с другими учениками и поднимайтесь в рейтинге. 
            Чем больше тем вы завершите, тем выше будет ваша позиция!
          </p>
        </div>

        {/* Статистика рейтинга */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{leaderboardData.length}</div>
            <div className="text-gray-600 font-medium">Участников</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Target className="w-8 h-8 text-secondary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {leaderboardData.reduce((sum, user) => sum + user.topics_completed, 0)}
            </div>
            <div className="text-gray-600 font-medium">Завершенных тем</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-8 h-8 text-accent-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {leaderboardData.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Общих очков</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(leaderboardData.reduce((sum, user) => sum + user.points, 0) / leaderboardData.length)}
            </div>
            <div className="text-gray-600 font-medium">Средний балл</div>
          </motion.div>
        </div>

        {/* Таблица лидеров */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Топ 10 учеников</h2>
            <p className="text-primary-100 mt-1">Рейтинг обновляется в реальном времени</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.user_id}
                  className={`group flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                      : 'bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-6">
                    {/* Ранг */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        index < 3 ? getRankColor(index + 1) : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      {getRankIcon(index + 1)}
                    </div>

                    {/* Аватар и информация */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">{getAvatarInitials(user.name)}</span>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          {user.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                            {getLevelIcon(user.level)} {user.level}
                          </span>
                          <span className="text-sm text-gray-500">• {user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Статистика */}
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">очков</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-secondary-600 transition-colors duration-200">
                        {user.topics_completed}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">тем</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-accent-600 transition-colors duration-200">
                        {Math.round(user.points / user.topics_completed) || 0}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">средний</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Информация о рейтинге */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Как работает рейтинг?</h3>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>За каждую завершенную тему вы получаете очки</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Чем выше результат в упражнениях, тем больше очков</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Рейтинг обновляется в реальном времени</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Топ-3 получают специальные награды</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Награды</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="font-bold text-gray-900">1 место - Золотая корона</h4>
                  <p className="text-sm text-gray-600">Высшая награда за отличные результаты</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                <Medal className="w-8 h-8 text-gray-400" />
                <div>
                  <h4 className="font-bold text-gray-900">2 место - Серебряная медаль</h4>
                  <p className="text-sm text-gray-600">Награда за упорство и трудолюбие</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <Medal className="w-8 h-8 text-amber-600" />
                <div>
                  <h4 className="font-bold text-gray-900">3 место - Бронзовая медаль</h4>
                  <p className="text-sm text-gray-600">Награда за стабильный прогресс</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Уровни CEFR</h3>
            </div>
            <div className="space-y-3">
              {['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getLevelIcon(level)}</span>
                    <span className="font-medium text-gray-900">{level}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(level)}`}>
                    {level === 'A0' ? 'Начинающий' :
                     level === 'A1' ? 'Элементарный' :
                     level === 'A2' ? 'Пред-средний' :
                     level === 'B1' ? 'Средний' :
                     level === 'B2' ? 'Выше среднего' :
                     level === 'C1' ? 'Продвинутый' : 'В совершенстве'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Leaderboard
