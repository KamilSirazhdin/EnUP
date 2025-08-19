import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Plus, Edit, Trash2, Users, BookOpen, BarChart3 } from 'lucide-react'
import { courseAPI } from '../services/api'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await courseAPI.getLevels()
        setLevels(response.data)
      } catch (error) {
        console.error('Error fetching levels:', error)
        setLevels([])
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'levels', label: 'Уровни', icon: BookOpen },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ]

  const stats = [
    { label: 'Всего уровней', value: levels.length, icon: BookOpen },
    { label: 'Всего тем', value: levels.reduce((sum, level) => sum + (level.topics?.length || 0), 0), icon: BookOpen },
    { label: 'Активных пользователей', value: 1250, icon: Users },
    { label: 'Завершенных курсов', value: 890, icon: BarChart3 },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    className="card-modern"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-modern">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Последняя активность</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Новый пользователь зарегистрировался</p>
                      <p className="text-sm text-gray-500">2 минуты назад</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Завершен уровень A1</p>
                      <p className="text-sm text-gray-500">15 минут назад</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Добавлена новая тема</p>
                      <p className="text-sm text-gray-500">1 час назад</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Добавить уровень</span>
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Редактировать курс</span>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Управление пользователями</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'levels':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Управление уровнями</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Добавить уровень</span>
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Загрузка уровней...</p>
                </div>
              ) : (
                levels.map((level, index) => (
                  <motion.div
                    key={level.id}
                    className="card-modern"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                        <p className="text-gray-600">{level.description}</p>
                        <p className="text-sm text-gray-500">{level.topics?.length || 0} тем</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Управление пользователями</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  className="input-field"
                />
                <button className="btn-primary">Поиск</button>
              </div>
            </div>

            <div className="card-modern">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Пользователь</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Уровень</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Прогресс</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">АП</span>
                          </div>
                          <span className="font-medium">Алексей Петров</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">alex@example.com</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                          B1
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-700 text-sm">Просмотр</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">МС</span>
                          </div>
                          <span className="font-medium">Мария Сидорова</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">maria@example.com</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                          A2
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-700 text-sm">Просмотр</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Настройки системы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-modern">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Общие настройки</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название курса
                    </label>
                    <input
                      type="text"
                      defaultValue="English Learning App"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Интерактивный курс английского языка"
                      className="input-field"
                    />
                  </div>
                  <button className="btn-primary">Сохранить изменения</button>
                </div>
              </div>

              <div className="card-modern">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Уведомления</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email уведомления</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Push уведомления</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Еженедельные отчеты</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
          <p className="text-gray-600">Управление курсом и пользователями</p>
        </div>

        {/* Табы */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Контент таба */}
        {renderTabContent()}
      </motion.div>
    </div>
  )
}

export default Admin
