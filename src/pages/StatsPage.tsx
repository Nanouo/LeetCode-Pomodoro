// Statistics Dashboard page
import { useState, useEffect } from 'react';
import { getProblemsLocal } from '../utils/problemStorage';
import type { Problem } from '../types';

export default function StatsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const loadedProblems = getProblemsLocal();
    setProblems(loadedProblems);
  }, []);

  // Calculate statistics
  const totalProblems = problems.length;
  const totalTimeSeconds = problems.reduce((sum, p) => sum + p.totalTimeSpent, 0);
  const totalHours = Math.floor(totalTimeSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  const totalSessions = problems.reduce((sum, p) => sum + p.sessionsCount, 0);
  const avgSessionsPerProblem = totalProblems > 0 ? (totalSessions / totalProblems).toFixed(1) : '0';

  // Calculate streak (consecutive days with solved problems)
  const calculateStreak = (): number => {
    if (problems.length === 0) return 0;

    const sortedDates = problems
      .map(p => p.dateSolved ? new Date(p.dateSolved) : null)
      .filter((date): date is Date => date !== null)
      .map(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .sort((a, b) => b - a); // Most recent first

    const uniqueDates = Array.from(new Set(sortedDates));
    
    if (uniqueDates.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Check if most recent is today or yesterday
    const mostRecent = uniqueDates[0];
    if (mostRecent !== todayTime && mostRecent !== todayTime - oneDayMs) {
      return 0; // Streak broken
    }

    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = uniqueDates[i - 1] - uniqueDates[i];
      if (diff === oneDayMs) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your LeetCode grinding progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Problems */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Problems
            </h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {totalProblems}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Problems solved
          </p>
        </div>

        {/* Total Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Time
            </h3>
            <span className="text-2xl">⏱️</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {totalHours}h {totalMinutes}m
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Time spent grinding
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {currentStreak}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {currentStreak === 1 ? 'Day' : 'Days'} in a row
          </p>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          By Difficulty
        </h3>
        <div className="space-y-4">
          {/* Easy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#00b8a3] text-white rounded-full text-sm font-semibold">
                  Easy
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {easyCount}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalProblems > 0 ? Math.round((easyCount / totalProblems) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#00b8a3] h-2 rounded-full transition-all"
                style={{ width: totalProblems > 0 ? `${(easyCount / totalProblems) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#ffc01e] text-gray-900 rounded-full text-sm font-semibold">
                  Medium
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {mediumCount}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalProblems > 0 ? Math.round((mediumCount / totalProblems) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#ffc01e] h-2 rounded-full transition-all"
                style={{ width: totalProblems > 0 ? `${(mediumCount / totalProblems) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#ef4743] text-white rounded-full text-sm font-semibold">
                  Hard
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {hardCount}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalProblems > 0 ? Math.round((hardCount / totalProblems) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[#ef4743] h-2 rounded-full transition-all"
                style={{ width: totalProblems > 0 ? `${(hardCount / totalProblems) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Average Sessions per Problem
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {avgSessionsPerProblem}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Pomodoro Sessions
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalSessions}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalProblems === 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No statistics yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Solve your first problem to start tracking your progress!
          </p>
        </div>
      )}
    </div>
  );
}
