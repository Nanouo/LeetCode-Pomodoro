// Problem Form Component - Enter problem details before starting timer
import { useState } from 'react';
import type { Difficulty } from '../../types';

interface ProblemFormProps {
  onStartSession: (problemName: string, difficulty: Difficulty) => void;
}

export default function ProblemForm({ onStartSession }: ProblemFormProps) {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problemName.trim()) {
      onStartSession(problemName.trim(), difficulty);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Start New Session
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Name Input */}
        <div>
          <label
            htmlFor="problemName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Problem Name
          </label>
          <input
            type="text"
            id="problemName"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            placeholder="e.g., Two Sum"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-leetcode-easy focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDifficulty('Easy')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'Easy'
                  ? 'bg-leetcode-easy text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setDifficulty('Medium')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'Medium'
                  ? 'bg-leetcode-medium text-gray-900'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setDifficulty('Hard')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'Hard'
                  ? 'bg-leetcode-hard text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!problemName.trim()}
          className="w-full py-3 bg-leetcode-easy text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Session
        </button>
      </form>
    </div>
  );
}
