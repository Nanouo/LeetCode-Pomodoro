// Hybrid storage system for problems
// Works with localStorage first, syncs to Firestore when available

import { Problem } from '../types';

const STORAGE_KEY = 'leetcode-pomodoro-problems';

// Save problem to localStorage
export function saveProblemLocal(problem: Problem): void {
  const problems = getProblemsLocal();
  problems.push(problem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

// Get all problems from localStorage
export function getProblemsLocal(): Problem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse problems from localStorage:', error);
    return [];
  }
}

// Delete a problem from localStorage
export function deleteProblemLocal(problemId: string): void {
  const problems = getProblemsLocal();
  const filtered = problems.filter(p => p.id !== problemId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Update a problem in localStorage
export function updateProblemLocal(problemId: string, updates: Partial<Problem>): void {
  const problems = getProblemsLocal();
  const index = problems.findIndex(p => p.id === problemId);
  
  if (index !== -1) {
    problems[index] = { ...problems[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  }
}

// Generate a unique ID for a problem
export function generateProblemId(): string {
  return `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
