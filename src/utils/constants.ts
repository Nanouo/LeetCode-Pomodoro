// Timer constants (in seconds)
export const WORK_TIME = 25 * 60; // 25 minutes
export const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
export const LONG_BREAK_TIME = 15 * 60; // 15 minutes
export const SESSIONS_UNTIL_LONG_BREAK = 4;

// Auto-save interval (in milliseconds)
export const AUTO_SAVE_INTERVAL = 30 * 1000; // 30 seconds

// Difficulty colors (matching Tailwind config)
export const DIFFICULTY_COLORS = {
  Easy: '#00b8a3',
  Medium: '#ffc01e',
  Hard: '#ef4743',
} as const;

// Difficulty text colors for contrast
export const DIFFICULTY_TEXT_COLORS = {
  Easy: 'text-white',
  Medium: 'text-gray-900',
  Hard: 'text-white',
} as const;

// Audio notification sound (can be replaced with actual audio file)
export const NOTIFICATION_SOUND_URL = '/notification.mp3';
