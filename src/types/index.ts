// Type definitions for LeetCode Pomodoro

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  problemName: string;
  difficulty: Difficulty;
  textNotes: string;
  videoUrl?: string;
  dateStarted: Date;
  dateSolved?: Date;
  sessionsCount: number;
  totalTimeSpent: number; // in seconds
  createdAt: Date;
}

export interface Session {
  id: string;
  problemId: string;
  date: Date;
  duration: number; // in seconds
  completed: boolean;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionCount: number;
  maxSessions: number;
}
