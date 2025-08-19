// Типы для пользователей
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  level: string
  points: number
  achievements: string[]
  createdAt?: Date
  updatedAt?: Date
}

// Типы для упражнений
export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'dialogue' | 'audio'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  audioUrl?: string
  imageUrl?: string
}

// Типы для тем
export interface Topic {
  id: string
  title: string
  description: string
  explanation: string
  associations: string[]
  examples: string[]
  exercises: Exercise[]
  requiredTopics?: string[]
  estimatedTime: number // в минутах
  difficulty: 'easy' | 'medium' | 'hard'
}

// Типы для уровней
export interface Level {
  id: string
  name: string
  description: string
  color: string
  topics: Topic[]
  requiredLevel?: string
  totalPoints: number
  estimatedTime: number // в часах
}

// Типы для прогресса
export interface TopicProgress {
  id: string
  completed: boolean
  score: number
  completedAt?: Date
  attempts: number
  timeSpent: number // в минутах
}

export interface LevelProgress {
  levelId: string
  topics: TopicProgress[]
  completed: boolean
  totalScore: number
  startedAt?: Date
  completedAt?: Date
}

export interface UserProgress {
  userId: string
  levels: LevelProgress[]
  overallScore: number
  totalTimeSpent: number
  lastActivityAt?: Date
}

// Типы для достижений
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  condition: string
  unlocked: boolean
  unlockedAt?: Date
}

// Типы для рейтинга
export interface LeaderboardEntry {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  level: string
  points: number
  completedTopics: number
  rank: number
  lastActivityAt?: Date
}

// Типы для AI чата
export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  topicId?: string
}

// Типы для API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Типы для форм
export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// Типы для навигации
export interface NavigationItem {
  id: string
  label: string
  path: string
  icon: any
  requiresAuth?: boolean
  isAdmin?: boolean
}

// Типы для статистики
export interface UserStats {
  totalTopics: number
  completedTopics: number
  totalPoints: number
  currentStreak: number
  longestStreak: number
  averageScore: number
  timeSpent: number
  achievementsCount: number
}

export interface LevelStats {
  levelId: string
  totalTopics: number
  completedTopics: number
  averageScore: number
  completionRate: number
  timeSpent: number
}

// Типы для админ-панели
export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTopics: number
  totalExercises: number
  averageCompletionRate: number
  popularTopics: string[]
}

// Типы для уведомлений
export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'progress' | 'system' | 'reminder'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

// Типы для настроек
export interface UserSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReports: boolean
  language: 'ru' | 'en'
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  autoPlayAudio: boolean
}

// Типы для ошибок
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

// Типы для событий
export interface UserEvent {
  id: string
  userId: string
  type: 'topic_completed' | 'level_completed' | 'achievement_unlocked' | 'login' | 'logout'
  data: any
  timestamp: Date
}

// Типы для экспорта/импорта
export interface ProgressExport {
  userId: string
  exportDate: Date
  progress: UserProgress
  achievements: Achievement[]
  settings: UserSettings
}

// Утилитарные типы
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export type SortDirection = 'asc' | 'desc'

export type FilterType = 'all' | 'completed' | 'in_progress' | 'locked'

export type ExerciseType = Exercise['type']

export type LevelId = Level['id']

export type TopicId = Topic['id']

export type UserId = User['id']
