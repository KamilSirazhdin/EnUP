import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, CheckCircle, Lock, BookOpen, Target } from 'lucide-react'
import { useProgress } from '../contexts/ProgressContext'
import { courseAPI } from '../services/api'
import { useState, useEffect } from 'react'

const LevelDetail = () => {
  const { levelId } = useParams<{ levelId: string }>()
  const { getTopicProgress, getLevelProgress } = useProgress()
  
  const level = getLevelById(levelId!)
  const levelProgress = getLevelProgress(levelId!)

  if (!level) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Уровень не найден</h1>
        <Link to="/levels" className="btn-primary">
          Вернуться к уровням
        </Link>
      </div>
    )
  }

  const isTopicUnlocked = (topicId: string): boolean => {
    const topic = getTopicById(levelId!, topicId)
    if (!topic?.requiredTopics || topic.requiredTopics.length === 0) {
      return true
    }
    
    return topic.requiredTopics.every(requiredTopicId => {
      const progress = getTopicProgress(levelId!, requiredTopicId)
      return progress?.completed || false
    })
  }

  const getTopicStatus = (topicId: string) => {
    const progress = getTopicProgress(levelId!, topicId)
    if (progress?.completed) {
      return { status: 'completed', score: progress.score }
    }
    if (isTopicUnlocked(topicId)) {
      return { status: 'available', score: 0 }
    }
    return { status: 'locked', score: 0 }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Заголовок уровня */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            to="/levels"
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: level.color }}
            >
              {level.id}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{level.name}</h1>
              <p className="text-gray-600">{level.description}</p>
            </div>
          </div>
        </div>

        {/* Прогресс уровня */}
        {levelProgress && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Прогресс уровня</h2>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary-600" />
                <span className="text-primary-600 font-semibold">
                  {levelProgress.topics.filter(t => t.completed).length} / {level.topics.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(levelProgress.topics.filter(t => t.completed).length / level.topics.length) * 100}%` 
                }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Общий счет: {levelProgress.totalScore}</span>
              <span>
                {levelProgress.completed ? 'Уровень завершен!' : 'Продолжайте обучение'}
              </span>
            </div>
          </div>
        )}

        {/* Список тем */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {level.topics.map((topic, index) => {
            const topicStatus = getTopicStatus(topic.id)
            const isUnlocked = isTopicUnlocked(topic.id)

            return (
              <motion.div
                key={topic.id}
                className="card relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {/* Статус темы */}
                <div className="absolute top-4 right-4">
                  {topicStatus.status === 'completed' ? (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {topicStatus.score}
                      </span>
                    </div>
                  ) : !isUnlocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Play className="w-5 h-5 text-primary-600" />
                  )}
                </div>

                {/* Цветная полоса */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: level.color }}
                />

                {/* Содержимое темы */}
                <div className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: level.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                      <p className="text-gray-600 mb-4">{topic.description}</p>
                      
                      {/* Информация о теме */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{topic.exercises.length} упражнений</span>
                        <span>~{topic.exercises.length * 5} мин</span>
                      </div>

                      {/* Кнопка действия */}
                      {isUnlocked ? (
                        <Link
                          to={`/levels/${levelId}/topics/${topic.id}`}
                          className="btn-primary flex items-center justify-center space-x-2 w-full"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>
                            {topicStatus.status === 'completed' ? 'Повторить' : 'Начать изучение'}
                          </span>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Заблокировано</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Информация о уровне */}
        <motion.div 
          className="mt-12 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">О уровне {level.id}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Что вы изучите:</h3>
              <ul className="space-y-2 text-gray-600">
                {level.topics.map(topic => (
                  <li key={topic.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>{topic.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендации:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Проходите темы последовательно</li>
                <li>• Выполняйте все упражнения</li>
                <li>• Повторяйте материал при необходимости</li>
                <li>• Практикуйтесь регулярно</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LevelDetail
