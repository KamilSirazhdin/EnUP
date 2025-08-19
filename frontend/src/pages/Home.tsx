import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Users, 
  Play, 
  ArrowRight, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { courseAPI } from '../services/api'
import { useState, useEffect } from 'react'

const Home = () => {
  const { user } = useAuth()
  const { getTotalProgress } = useProgress()
  const totalProgress = getTotalProgress()
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await courseAPI.getLevels()
        setLevels(response.data)
      } catch (error) {
        console.error('Error fetching levels:', error)
        // Clean mock data
        setLevels([
          { 
            id: '1', 
            name: 'A0', 
            title: 'Первые шаги', 
            description: 'Начните свой путь в изучении английского с самых основ', 
            topics: []
          },
          { 
            id: '2', 
            name: 'A1', 
            title: 'Базовые навыки', 
            description: 'Научитесь общаться в простых повседневных ситуациях', 
            topics: []
          },
          { 
            id: '3', 
            name: 'A2', 
            title: 'Повседневное общение', 
            description: 'Свободно общайтесь в знакомых ситуациях', 
            topics: []
          },
          { 
            id: '4', 
            name: 'B1', 
            title: 'Независимое использование', 
            description: 'Говорите уверенно на знакомые темы', 
            topics: []
          },
          { 
            id: '5', 
            name: 'B2', 
            title: 'Свободное общение', 
            description: 'Общайтесь на любые темы без затруднений', 
            topics: []
          },
          { 
            id: '6', 
            name: 'C1', 
            title: 'Профессиональное владение', 
            description: 'Используйте английский в работе и учебе', 
            topics: []
          },
          { 
            id: '7', 
            name: 'C2', 
            title: 'Мастерство', 
            description: 'Владейте языком в совершенстве', 
            topics: []
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  // Daily streak data
  const streakDays = [
    { day: 'Пн', completed: true },
    { day: 'Вт', completed: true },
    { day: 'Ср', completed: true },
    { day: 'Чт', completed: true },
    { day: 'Пт', completed: true },
    { day: 'Сб', completed: true },
    { day: 'Вс', completed: true },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl font-bold text-text max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Изучайте английский с удовольствием
            </motion.h1>
            
            <motion.p 
              className="text-base text-muted max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Интерактивный курс, который превращает изучение английского в увлекательное приключение. 
              От первых слов до свободного общения — всё в одном месте.
            </motion.p>

            {user ? (
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
                <Link to="/levels" className="btn btn-primary">
                  <Play className="w-5 h-5 mr-2" />
                  Продолжить обучение
                </Link>
                <Link to="/leaderboard" className="btn btn-secondary">
                  <Trophy className="w-5 h-5 mr-2" />
                  Соревноваться с друзьями
                </Link>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
                <Link to="/register" className="btn btn-primary">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Начать бесплатно
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Войти в аккаунт
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Progress Section for logged in users */}
      {user && (
        <section className="py-12 bg-surface border-t border-border">
          <div className="container">
            <div className="card">
              <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <h2 className="text-2xl font-bold text-text mb-2">Твой прогресс</h2>
                  <p className="text-muted">Продолжай в том же духе</p>
                </div>
                <div className="flex items-center space-x-3 bg-muted px-4 py-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-text">7 дней</div>
                    <div className="text-sm text-muted">подряд</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">{totalProgress}%</div>
                  <div className="text-sm text-muted">Общий прогресс</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">12</div>
                  <div className="text-sm text-muted">Завершённых тем</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">{user.points}</div>
                  <div className="text-sm text-muted">Заработанных очков</div>
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text mb-4">Твоя серия занятий</h3>
                <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
                  {streakDays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-colors ${
                        day.completed
                          ? 'bg-success text-white'
                          : 'bg-muted text-muted border border-border'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{day.day}</div>
                      <div className="w-6 h-6 mx-auto">
                        {day.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-muted rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted mt-4 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Рекомендуется заниматься 15-20 минут в день
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Levels Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Выбери свой уровень</h2>
            <p className="text-base text-muted max-w-2xl mx-auto">
              Начни с любого уровня или продолжи обучение там, где остановился
            </p>
          </div>
          
          <div className="grid-levels">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted">Загружаем уровни...</p>
              </div>
            ) : (
              levels.map((level, index) => {
                // Calculate progress for each level (mock data)
                const levelProgress = Math.floor(Math.random() * 100)
                const isCompleted = levelProgress === 100
                const isInProgress = levelProgress > 0 && levelProgress < 100
                
                return (
                  <motion.div
                    key={level.id}
                    className="level-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  >
                    <div className="level-title">{level.name}</div>
                    <div className="level-description">{level.description}</div>
                    
                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text">Прогресс</span>
                        <span className="text-sm font-medium text-text">{levelProgress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${levelProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-muted">
                        <Target className="w-4 h-4 mr-1" />
                        {level.topics?.length || 8} тем
                      </div>
                      <div className="flex items-center text-sm text-muted">
                        <Clock className="w-4 h-4 mr-1" />
                        ~2 часа
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="space-y-3">
                      <Link 
                        to={`/levels/${level.id}`}
                        className="btn btn-primary w-full"
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Повторить
                          </>
                        ) : isInProgress ? (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Продолжить
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Начать обучение
                          </>
                        )}
                      </Link>
                      <Link 
                        to={`/levels/${level.id}`}
                        className="btn btn-secondary w-full"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Посмотреть темы
                      </Link>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Почему наш курс?</h2>
            <p className="text-base text-muted max-w-2xl mx-auto">
              Мы создали идеальную среду для изучения английского языка
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Структурированный курс</h3>
              <p className="text-muted leading-relaxed">
                7 уровней от A0 до C2 с чёткой последовательностью обучения. Каждый уровень построен на предыдущем, обеспечивая стабильный прогресс.
              </p>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Интерактивные упражнения</h3>
              <p className="text-muted leading-relaxed">
                Разнообразные задания для закрепления материала: тесты, диалоги, аудио-упражнения и многое другое.
              </p>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Система достижений</h3>
              <p className="text-muted leading-relaxed">
                Отслеживай прогресс, получай награды и бей рекорды. Геймификация делает обучение увлекательным.
              </p>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Соревнования</h3>
              <p className="text-muted leading-relaxed">
                Соревнуйся с друзьями, поднимайся в рейтинге и мотивируйся достижениями других учеников.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-text mb-4">Готов начать?</h2>
            <p className="text-base text-muted mb-8 max-w-2xl mx-auto">
              Присоединяйся к тысячам учеников, которые уже изучают английский с нами
            </p>
            {!user && (
              <Link to="/register" className="btn btn-primary">
                <BookOpen className="w-5 h-5 mr-2" />
                Начать бесплатно
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
