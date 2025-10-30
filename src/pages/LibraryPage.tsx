// Library page - Display all solved problems
import { useState, useEffect } from 'react';
import { getProblemsLocal, deleteProblemLocal } from '../utils/problemStorage';
import { deleteProblem } from '../utils/firestore';
import type { Problem, Difficulty } from '../types';
import { format } from 'date-fns';

export default function LibraryPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  // Load problems on mount
  useEffect(() => {
    loadProblems();
  }, []);

  // Filter and sort when criteria change
  useEffect(() => {
    filterAndSortProblems();
  }, [problems, searchQuery, difficultyFilter, sortBy]);

  const loadProblems = () => {
    const loadedProblems = getProblemsLocal();
    setProblems(loadedProblems);
  };

  const filterAndSortProblems = () => {
    let filtered = [...problems];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.problemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => {
        const dateA = a.dateSolved ? new Date(a.dateSolved).getTime() : 0;
        const dateB = b.dateSolved ? new Date(b.dateSolved).getTime() : 0;
        return dateB - dateA; // Most recent first
      });
    } else {
      filtered.sort((a, b) => a.problemName.localeCompare(b.problemName));
    }

    setFilteredProblems(filtered);
  };

  const toggleExpanded = (problemId: string) => {
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  const handleDelete = async (problemId: string, problemName: string) => {
    if (window.confirm(`Are you sure you want to delete "${problemName}"? This action cannot be undone.`)) {
      deleteProblemLocal(problemId);
      try {
        await deleteProblem(problemId);
        console.log('Deleted from Firestore:', problemId);
      } catch (err) {
        console.error('Failed to delete from Firestore:', err);
      }
      loadProblems(); // Reload the list
      // Close expanded view if this problem was expanded
      if (expandedProblemId === problemId) {
        setExpandedProblemId(null);
      }
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[#00b8a3] text-white';
      case 'Medium':
        return 'bg-[#ffc01e] text-gray-900';
      case 'Hard':
        return 'bg-[#ef4743] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Solved Problems ({problems.length})
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal library of conquered LeetCode problems
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00b8a3] focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'All')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00b8a3] focus:border-transparent"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00b8a3] focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery || difficultyFilter !== 'All' ? 'No problems found' : 'No solved problems yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || difficultyFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'Start a timer session and solve your first problem!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Problem Header */}
              <button
                onClick={() => toggleExpanded(problem.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {problem.problemName}
                  </h3>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <span>{problem.dateSolved && format(new Date(problem.dateSolved), 'MMM dd, yyyy')}</span>
                  <span>{problem.sessionsCount} session{problem.sessionsCount !== 1 ? 's' : ''}</span>
                  <span className="text-2xl">
                    {expandedProblemId === problem.id ? '▼' : '►'}
                  </span>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedProblemId === problem.id && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metadata */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Details
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Total Time:</span> {formatTime(problem.totalTimeSpent)}
                        </div>
                        <div>
                          <span className="font-medium">Sessions:</span> {problem.sessionsCount}
                        </div>
                        <div>
                          <span className="font-medium">Started:</span>{' '}
                          {format(new Date(problem.dateStarted), 'MMM dd, yyyy h:mm a')}
                        </div>
                        {problem.dateSolved && (
                          <div>
                            <span className="font-medium">Solved:</span>{' '}
                            {format(new Date(problem.dateSolved), 'MMM dd, yyyy h:mm a')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Notes
                      </h4>
                      {problem.textNotes ? (
                        <div className="bg-white dark:bg-gray-800 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                          {problem.textNotes}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                          No notes taken for this problem
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleDelete(problem.id, problem.problemName)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      Delete Problem
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
