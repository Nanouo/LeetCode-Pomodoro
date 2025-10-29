// Time formatting utilities
// Uses date-fns as specified in PRD Section 4.1

import { format, formatDistance, formatDistanceToNow, differenceInDays } from 'date-fns';

/**
 * Format seconds into MM:SS format for timer display
 * @param seconds - Total seconds
 * @returns Formatted string like "25:00" or "04:32"
 */
export function formatTimerDisplay(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format total time spent in human-readable format
 * @param seconds - Total seconds
 * @returns Formatted string like "2h 15m" or "45m"
 */
export function formatTotalTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format date for problem list display
 * @param date - Date to format
 * @returns Formatted string like "Oct 28, 2025"
 */
export function formatProblemDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

/**
 * Format date relative to now
 * @param date - Date to format
 * @returns Formatted string like "2 days ago" or "just now"
 */
export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Calculate current streak from session dates
 * @param sessionDates - Array of dates when sessions were completed
 * @returns Number of consecutive days
 */
export function calculateStreak(sessionDates: Date[]): number {
  if (sessionDates.length === 0) return 0;
  
  // Sort dates in descending order (most recent first)
  const sortedDates = sessionDates
    .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    .sort((a, b) => b.getTime() - a.getTime());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if most recent session was today or yesterday
  const mostRecent = sortedDates[0];
  const daysDiff = differenceInDays(today, mostRecent);
  
  if (daysDiff > 1) return 0; // Streak broken
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const sessionDate of sortedDates) {
    const diff = differenceInDays(currentDate, sessionDate);
    
    if (diff === 0) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diff === 1) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
}

/**
 * Format duration in a readable way
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted string like "5 minutes" or "2 hours"
 */
export function formatDuration(startDate: Date, endDate: Date): string {
  return formatDistance(startDate, endDate);
}
