// Custom hook for Pomodoro timer logic
import { useState, useEffect, useCallback, useRef } from 'react';
import { WORK_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME, SESSIONS_UNTIL_LONG_BREAK } from '../utils/constants';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  mode: TimerMode;
  sessionCount: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
}

export function useTimer(): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Get duration for current mode
  const getDuration = useCallback((timerMode: TimerMode): number => {
    switch (timerMode) {
      case 'work':
        return WORK_TIME;
      case 'shortBreak':
        return SHORT_BREAK_TIME;
      case 'longBreak':
        return LONG_BREAK_TIME;
    }
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(getDuration(mode));
  }, [mode, getDuration]);

  // Switch timer mode
  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeRemaining(getDuration(newMode));
    setIsRunning(false);
  }, [getDuration]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            
            // Timer completed!
            if (mode === 'work') {
              const newSessionCount = sessionCount + 1;
              setSessionCount(newSessionCount);
              
              // TODO: Play notification sound
              // TODO: Show "Did you solve it?" modal
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, mode, sessionCount]);

  return {
    timeRemaining,
    isRunning,
    mode,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  };
}
