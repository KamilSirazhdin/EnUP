import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { Exercise } from '../data/courseData'

interface ExerciseComponentProps {
  exercise: Exercise
  onComplete: (exerciseId: string, isCorrect: boolean) => void
  onNext: () => void
}

const ExerciseComponent = ({ exercise, onComplete, onNext }: ExerciseComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleSubmit = () => {
    let correct = false

    switch (exercise.type) {
      case 'multiple-choice':
        correct = selectedAnswer === exercise.correctAnswer
        break
      case 'fill-blank':
        correct = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()
        break
      case 'translation':
        correct = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()
        break
      default:
        correct = false
    }

    setIsCorrect(correct)
    setIsAnswered(true)
    setShowExplanation(true)
    onComplete(exercise.id, correct)
  }

  const handleNext = () => {
    setSelectedAnswer('')
    setUserAnswer('')
    setIsAnswered(false)
    setIsCorrect(false)
    setShowExplanation(false)
    onNext()
  }

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{exercise.question}</h3>
            <div className="space-y-3">
              {exercise.options?.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => !isAnswered && setSelectedAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === option
                      ? isAnswered
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isAnswered && selectedAnswer === option && (
                      isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {exercise.question.replace('___', '_____')}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Введите ответ..."
                className="input-field text-lg text-center"
              />
            </div>
          </div>
        )

      case 'translation':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Переведите на английский язык:
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-700">{exercise.question}</p>
            </div>
            <div className="space-y-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Введите перевод..."
                rows={3}
                className="input-field text-lg resize-none"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <p className="text-gray-600">Тип упражнения не поддерживается</p>
          </div>
        )
    }
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderExerciseContent()}

      {/* Кнопки действий */}
      <div className="mt-8 flex justify-between items-center">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={
              (exercise.type === 'multiple-choice' && !selectedAnswer) ||
              (exercise.type === 'fill-blank' && !userAnswer.trim()) ||
              (exercise.type === 'translation' && !userAnswer.trim())
            }
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Проверить ответ</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isCorrect ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {isCorrect ? 'Правильно!' : 'Неправильно'}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Следующее</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Объяснение */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Объяснение:</h4>
          <p className="text-blue-800">{exercise.explanation}</p>
          {!isCorrect && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                <strong>Правильный ответ:</strong> {exercise.correctAnswer}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Информация о баллах */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          За это упражнение можно получить {exercise.points} очков
        </span>
      </div>
    </motion.div>
  )
}

export default ExerciseComponent
