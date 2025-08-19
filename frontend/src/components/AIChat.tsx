import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Lightbulb, MessageCircle, BookOpen } from 'lucide-react'
import { Topic } from '../data/courseData'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIChatProps {
  topic: Topic
}

const AIChat = ({ topic }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Привет! Я твой AI-помощник по теме "${topic.title}". Могу объяснить материал, привести дополнительные примеры или помочь с упражнениями. Что тебя интересует?`,
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    'Объясни правило подробнее',
    'Приведи больше примеров',
    'Как это использовать в жизни?',
    'Помоги с упражнением',
    'Какие есть исключения?'
  ]

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Имитация AI ответов на основе контекста темы
    if (lowerMessage.includes('объясни') || lowerMessage.includes('правило')) {
      return `Конечно! ${topic.explanation} 

Основные моменты:
• ${topic.associations[0]}
• ${topic.associations[1]}

Попробуй представить это как ${topic.associations[2]?.toLowerCase() || 'конкретную ситуацию'}.`
    }
    
    if (lowerMessage.includes('пример') || lowerMessage.includes('больше')) {
      return `Вот дополнительные примеры использования:

${topic.examples.map((example, index) => `${index + 1}. ${example}`).join('\n')}

Также можно сказать:
• "I always study English" (я всегда изучаю английский)
• "She usually works late" (она обычно работает допоздна)
• "They often travel abroad" (они часто путешествуют за границу)`
    }
    
    if (lowerMessage.includes('жизнь') || lowerMessage.includes('использовать')) {
      return `В реальной жизни это используется постоянно! Например:

🏢 На работе: "I work from 9 to 5"
🏠 Дома: "I usually cook dinner"
🏪 В магазине: "I often buy groceries here"
✈️ В путешествиях: "I always take my passport"

Попробуй составить свои предложения о том, что ты делаешь регулярно!`
    }
    
    if (lowerMessage.includes('упражнение') || lowerMessage.includes('помоги')) {
      return `Конечно! Вот несколько советов для упражнений:

1. Внимательно читай вопрос
2. Вспомни правило: ${topic.explanation.split('.')[0]}
3. Используй ассоциации: ${topic.associations[0]}
4. Проверь свой ответ

Если не уверен, попробуй подставить разные варианты и посмотри, какой звучит естественнее.`
    }
    
    if (lowerMessage.includes('исключение') || lowerMessage.includes('особенность')) {
      return `Отличный вопрос! В этой теме есть несколько важных моментов:

⚠️ Исключения:
• Некоторые глаголы имеют особые формы
• В вопросах порядок слов меняется
• В отрицаниях добавляется "not"

💡 Запомни: ${topic.associations[1]}

Это поможет избежать типичных ошибок!`
    }
    
    // Общий ответ
    return `Интересный вопрос! В контексте темы "${topic.title}" это связано с тем, что ${topic.explanation.split('.')[0]}. 

Попробуй применить это правило в практике. Если у тебя есть конкретные вопросы по упражнениям или нужны дополнительные примеры, я готов помочь!`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Имитация задержки AI
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  return (
    <motion.div
      className="card h-[600px] flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Заголовок */}
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Помощник</h3>
          <p className="text-sm text-gray-500">Тема: {topic.title}</p>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && (
                  <Bot className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.isUser && (
                  <User className="w-4 h-4 text-primary-100 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Быстрые вопросы */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Быстрые вопросы:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors duration-200"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Ввод сообщения */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Задайте вопрос..."
          className="flex-1 input-field"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default AIChat
