import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lightbulb, 
  BookOpen, 
  Target,
  MessageCircle,
  Trophy,
  ArrowRight,
  RefreshCw,
  Clock,
  Star,
  Users
} from 'lucide-react'
import { useProgress } from '../contexts/ProgressContext'
import { courseAPI } from '../services/api'
import ExerciseComponent from '../components/ExerciseComponent'
import AIChat from '../components/AIChat'

type Step = 'explanation' | 'examples' | 'exercises' | 'results'

interface Topic {
  id: string
  name: string
  title: string
  description: string
  content: string
  order: number
  is_active: boolean
  exercises: Exercise[]
}

interface Exercise {
  id: string
  type: string
  question: string
  options?: string[]
  points: number
  order: number
}

const TopicDetail = () => {
  const { levelId, topicId } = useParams<{ levelId: string; topicId: string }>()
  const [currentStep, setCurrentStep] = useState<Step>('explanation')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseResults, setExerciseResults] = useState<{ [key: string]: boolean }>({})
  const [showAI, setShowAI] = useState(false)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { completeTopic } = useProgress()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) return
      
      try {
        setLoading(true)
        const response = await courseAPI.getTopic(topicId)
        setTopic(response.data)
      } catch (err) {
        setError('Ошибка загрузки темы')
        console.error('Error fetching topic:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [topicId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка темы...</p>
        </div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Тема не найдена</h1>
          <p className="text-gray-600 mb-6">{error || 'Тема не существует'}</p>
          <Link to="/levels" className="btn-primary">
            Вернуться к уровням
          </Link>
        </div>
      </div>
    )
  }

  const steps: { key: Step; label: string; icon: any; description: string }[] = [
    { 
      key: 'explanation', 
      label: 'Объяснение', 
      icon: BookOpen,
      description: 'Изучите теорию и основные правила'
    },
    { 
      key: 'examples', 
      label: 'Примеры', 
      icon: MessageCircle,
      description: 'Посмотрите примеры использования'
    },
    { 
      key: 'exercises', 
      label: 'Упражнения', 
      icon: Target,
      description: 'Проверьте свои знания'
    },
    { 
      key: 'results', 
      label: 'Результаты', 
      icon: Trophy,
      description: 'Посмотрите свои результаты'
    }
  ]

  const handleExerciseComplete = (exerciseId: string, isCorrect: boolean) => {
    setExerciseResults(prev => ({
      ...prev,
      [exerciseId]: isCorrect
    }))
  }

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key)
    }
  }

  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key)
    }
  }

  const handleCompleteTopic = async () => {
    const correctAnswers = Object.values(exerciseResults).filter(result => result).length
    const totalExercises = topic.exercises.length
    const score = Math.round((correctAnswers / totalExercises) * 100)
    
    try {
      await completeTopic(levelId!, topicId!, score)
      // Переходим к следующей теме или уровню
      navigate(`/levels/${levelId}`)
    } catch (error) {
      console.error('Error completing topic:', error)
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 'explanation':
        return (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Теория</h2>
                  <p className="text-gray-600">Изучите основные правила и концепции</p>
                </div>
              </div>
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          </motion.div>
        )

      case 'examples':
        return (
          <motion.div
            key="examples"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-secondary-50 to-accent-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Примеры</h2>
                  <p className="text-gray-600">Посмотрите, как это используется на практике</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Правильное использование</h3>
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✅ Hello, how are you?</p>
                    <p className="text-green-600 font-medium">✅ Good morning!</p>
                    <p className="text-green-600 font-medium">✅ Nice to meet you!</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Частые ошибки</h3>
                  <div className="space-y-2">
                    <p className="text-red-600 font-medium">❌ Good morning (в вечернее время)</p>
                    <p className="text-red-600 font-medium">❌ Hi there (в формальной ситуации)</p>
                    <p className="text-red-600 font-medium">❌ Hello (без учета контекста)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'exercises':
        return (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Упражнения</h2>
                  <p className="text-gray-600">Проверьте свои знания</p>
                </div>
              </div>
              
              {topic.exercises.length > 0 ? (
                <div className="space-y-6">
                  {topic.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">Упражнение {index + 1} из {topic.exercises.length}</span>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {exercise.points} очков
                        </span>
                      </div>
                      <ExerciseComponent
                        exercise={exercise}
                        onComplete={(isCorrect) => handleExerciseComplete(exercise.id, isCorrect)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Упражнения для этой темы пока не добавлены</p>
                </div>
              )}
            </div>
          </motion.div>
        )

      case 'results':
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Результаты</h2>
                  <p className="text-gray-600">Ваши достижения в этой теме</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Правильных ответов</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {Object.values(exerciseResults).filter(result => result).length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Всего упражнений</h3>
                  <p className="text-2xl font-bold text-blue-600">{topic.exercises.length}</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Процент успеха</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {topic.exercises.length > 0 
                      ? Math.round((Object.values(exerciseResults).filter(result => result).length / topic.exercises.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleCompleteTopic}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Завершить тему
                </button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link 
            to={`/levels/${levelId}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад к уровню</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{topic.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>15-20 мин</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{topic.exercises.length} упражнений</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>1.2k изучают</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Помощник</span>
            </button>
          </div>
        </div>
      </div>

      {/* Прогресс шагов */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Прогресс изучения</h2>
            <span className="text-sm text-gray-500">
              Шаг {steps.findIndex(step => step.key === currentStep) + 1} из {steps.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const isActive = step.key === currentStep
              const isCompleted = steps.findIndex(s => s.key === currentStep) > index
              const Icon = step.icon
              
              return (
                <div
                  key={step.key}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-primary-500 bg-primary-50'
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => setCurrentStep(step.key)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-primary-100 text-primary-600'
                        : isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium text-sm ${
                        isActive ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </h3>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          {getStepContent()}
        </AnimatePresence>
      </div>

      {/* Навигация */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === steps[0].key}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>
        
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps[steps.length - 1].key}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Далее</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Чат */}
      {showAI && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          <AIChat />
        </div>
      )}
    </div>
  )
}

export default TopicDetail
