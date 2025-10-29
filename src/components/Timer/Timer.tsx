// Timer Component - Displays the Pomodoro countdown
import { useTimer } from '../../hooks/useTimer';

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function Timer() {
  const {
    timeRemaining,
    isRunning,
    mode,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      {/* Mode indicator */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {mode === 'work' && 'Work Session'}
          {mode === 'shortBreak' && 'Short Break'}
          {mode === 'longBreak' && 'Long Break'}
        </span>
      </div>

      {/* Timer display */}
      <div className="text-center mb-8">
        <div className="text-7xl font-bold font-mono text-gray-900 dark:text-white">
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Session counter */}
      <div className="text-center mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Session {sessionCount + 1} / 4
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-8 py-3 bg-leetcode-easy text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
