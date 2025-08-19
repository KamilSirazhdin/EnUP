import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  completed: boolean;
  score: number;
  completed_at?: string;
  topic?: {
    id: string;
    name: string;
    title: string;
  };
}

interface ProgressContextType {
  progress: UserProgress[];
  loading: boolean;
  refreshProgress: () => Promise<void>;
  completeTopic: (topicId: string, score: number) => Promise<void>;
  getTopicProgress: (topicId: string) => UserProgress | undefined;
  getLevelProgress: (levelId: string) => number;
  getTotalProgress: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshProgress = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProgress();
      setProgress(response.data);
    } catch (error: any) {
      console.error('Failed to fetch progress:', error);
      toast.error('Не удалось загрузить прогресс');
    } finally {
      setLoading(false);
    }
  };

  const completeTopic = async (topicId: string, score: number) => {
    try {
      await userAPI.completeTopic({ topic_id: topicId, score });
      await refreshProgress();
      toast.success('Тема завершена!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка при завершении темы';
      toast.error(message);
      throw error;
    }
  };

  const getTopicProgress = (topicId: string) => {
    return progress.find(p => p.topic_id === topicId);
  };

  const getLevelProgress = (levelId: string) => {
    const levelTopics = progress.filter(p => p.topic?.level_id === levelId);
    if (levelTopics.length === 0) return 0;
    
    const completedTopics = levelTopics.filter(p => p.completed);
    return Math.round((completedTopics.length / levelTopics.length) * 100);
  };

  const getTotalProgress = () => {
    if (progress.length === 0) return 0;
    
    const completedTopics = progress.filter(p => p.completed);
    return Math.round((completedTopics.length / progress.length) * 100);
  };

  const value: ProgressContextType = {
    progress,
    loading,
    refreshProgress,
    completeTopic,
    getTopicProgress,
    getLevelProgress,
    getTotalProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
