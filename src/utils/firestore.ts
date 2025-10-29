// Firebase database operations for problems and sessions
// Based on PRD Section 4.2 Data Models

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Problem, Session } from '../types';

// Collection names
const PROBLEMS_COLLECTION = 'problems';
const SESSIONS_COLLECTION = 'sessions';

// ============= PROBLEM OPERATIONS =============

/**
 * Create a new problem in Firestore
 */
export async function createProblem(
  userId: string,
  problemName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  textNotes: string = ''
): Promise<string> {
  const problemData = {
    userId,
    problemName,
    difficulty,
    textNotes,
    videoUrl: null,
    dateStarted: serverTimestamp(),
    dateSolved: null,
    sessionsCount: 0,
    totalTimeSpent: 0,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PROBLEMS_COLLECTION), problemData);
  return docRef.id;
}

/**
 * Update problem notes
 */
export async function updateProblemNotes(
  problemId: string,
  textNotes: string
): Promise<void> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  await updateDoc(problemRef, {
    textNotes,
  });
}

/**
 * Mark problem as solved
 */
export async function markProblemSolved(
  problemId: string,
  videoUrl?: string
): Promise<void> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  const updateData: any = {
    dateSolved: serverTimestamp(),
  };
  
  if (videoUrl) {
    updateData.videoUrl = videoUrl;
  }
  
  await updateDoc(problemRef, updateData);
}

/**
 * Increment session count for a problem
 */
export async function incrementSessionCount(problemId: string): Promise<void> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  const problemSnap = await getDoc(problemRef);
  
  if (problemSnap.exists()) {
    const currentCount = problemSnap.data().sessionsCount || 0;
    await updateDoc(problemRef, {
      sessionsCount: currentCount + 1,
    });
  }
}

/**
 * Update total time spent on a problem
 */
export async function updateProblemTime(
  problemId: string,
  additionalSeconds: number
): Promise<void> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  const problemSnap = await getDoc(problemRef);
  
  if (problemSnap.exists()) {
    const currentTime = problemSnap.data().totalTimeSpent || 0;
    await updateDoc(problemRef, {
      totalTimeSpent: currentTime + additionalSeconds,
    });
  }
}

/**
 * Get all problems for a user
 */
export async function getProblemsForUser(userId: string): Promise<Problem[]> {
  const q = query(
    collection(db, PROBLEMS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const problems: Problem[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    problems.push({
      id: doc.id,
      ...data,
      dateStarted: data.dateStarted?.toDate() || new Date(),
      dateSolved: data.dateSolved?.toDate() || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Problem);
  });
  
  return problems;
}

/**
 * Get a single problem by ID
 */
export async function getProblemById(problemId: string): Promise<Problem | null> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  const problemSnap = await getDoc(problemRef);
  
  if (!problemSnap.exists()) {
    return null;
  }
  
  const data = problemSnap.data();
  return {
    id: problemSnap.id,
    ...data,
    dateStarted: data.dateStarted?.toDate() || new Date(),
    dateSolved: data.dateSolved?.toDate() || undefined,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Problem;
}

/**
 * Delete a problem
 */
export async function deleteProblem(problemId: string): Promise<void> {
  const problemRef = doc(db, PROBLEMS_COLLECTION, problemId);
  await deleteDoc(problemRef);
}

// ============= SESSION OPERATIONS =============

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  problemId: string,
  duration: number,
  completed: boolean = false
): Promise<string> {
  const sessionData = {
    userId,
    problemId,
    date: serverTimestamp(),
    duration,
    completed,
  };
  
  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
  return docRef.id;
}

/**
 * Get all sessions for a user
 */
export async function getSessionsForUser(userId: string): Promise<Session[]> {
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const sessions: Session[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sessions.push({
      id: doc.id,
      ...data,
      date: data.date?.toDate() || new Date(),
    } as Session);
  });
  
  return sessions;
}

/**
 * Get sessions for a specific problem
 */
export async function getSessionsForProblem(problemId: string): Promise<Session[]> {
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('problemId', '==', problemId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const sessions: Session[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sessions.push({
      id: doc.id,
      ...data,
      date: data.date?.toDate() || new Date(),
    } as Session);
  });
  
  return sessions;
}
