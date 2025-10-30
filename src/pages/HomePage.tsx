// Home page - Timer and Problem Entry
import { useState, useEffect } from 'react';
import ProblemForm from '../components/ProblemForm/ProblemForm';
import Timer from '../components/Timer/Timer';
import NotesPanel from '../components/Notes/NotesPanel';
import CompletionModal from '../components/CompletionModal/CompletionModal';
import { playNotificationSound } from '../utils/audio';
import { saveProblemLocal, generateProblemId } from '../utils/problemStorage';
import { createProblem } from '../utils/firestore';
import { auth } from '../utils/firebase';
import type { Difficulty, Problem } from '../types';

export default function HomePage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<{
    name: string;
    difficulty: Difficulty;
  } | null>(null);
  const [notes, setNotes] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionCount, setSessionCount] = useState(1);

  const handleStartSession = (problemName: string, difficulty: Difficulty) => {
    setCurrentProblem({ name: problemName, difficulty });
    setSessionStarted(true);
    setSessionStartTime(new Date());
    setSessionCount(1);
    
    // Load saved notes from localStorage if they exist
    const savedNotes = localStorage.getItem(`notes-${problemName}`);
    setNotes(savedNotes || '');
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
  };

  // Auto-save notes to localStorage every 30 seconds
  useEffect(() => {
    if (currentProblem && notes) {
      const saveTimer = setInterval(() => {
        localStorage.setItem(`notes-${currentProblem.name}`, notes);
        console.log('Notes auto-saved to localStorage');
      }, 30000); // 30 seconds

      return () => clearInterval(saveTimer);
    }
  }, [currentProblem, notes]);

  const handleTimerComplete = () => {
    playNotificationSound();
    setShowCompletionModal(true);
  };

  const handleSolved = async () => {
    setShowCompletionModal(false);
    if (!currentProblem || !sessionStartTime) return;

    // Create problem object
    const problem: Problem = {
      id: generateProblemId(),
      problemName: currentProblem.name,
      difficulty: currentProblem.difficulty,
      textNotes: notes,
      dateStarted: sessionStartTime,
      dateSolved: new Date(),
      sessionsCount: sessionCount,
      totalTimeSpent: sessionCount * 1500, // 25 minutes per session in seconds
      createdAt: new Date(),
    };

    // Save to localStorage
    saveProblemLocal(problem);
    console.log('Problem saved locally:', problem);

    // Save to Firestore (if user is authenticated)
    try {
      const userId = auth.currentUser?.uid || 'anonymous';
      // Use the local problem.id as the Firestore document id so later
      // deletes/updates (which reference the local id) map correctly.
      await createProblem(
        userId,
        problem.problemName,
        problem.difficulty,
        problem.textNotes,
        problem.id
      );
      console.log('Problem synced to Firestore');
    } catch (err) {
      console.error('Failed to sync problem to Firestore:', err);
    }

    // Clean up saved notes
    localStorage.removeItem(`notes-${currentProblem.name}`);

    alert('Congratulations! 🎉 Problem saved to your library!');
    setSessionStarted(false);
    setCurrentProblem(null);
    setNotes('');
    setSessionStartTime(null);
    setSessionCount(1);
  };

  const handleKeepWorking = () => {
    setShowCompletionModal(false);
    setSessionCount(prev => prev + 1);
    // TODO: Start 5-minute break, then restart timer
    alert('Taking a 5-minute break... (Break timer will be added soon)');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {!sessionStarted ? (
        // Show problem form before session starts
        <div className="max-w-2xl mx-auto">
          <ProblemForm onStartSession={handleStartSession} />
        </div>
      ) : (
        // Show timer + notes layout during session
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Timer */}
            <div>
              <Timer onTimerComplete={handleTimerComplete} />
              <button
                onClick={() => {
                  setSessionStarted(false);
                  setCurrentProblem(null);
                }}
                className="mt-4 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Problem Selection
              </button>
            </div>

            {/* Right side - Notes */}
            <div className="lg:h-[600px]">
              {currentProblem && (
                <NotesPanel
                  problemName={currentProblem.name}
                  difficulty={currentProblem.difficulty}
                  initialNotes={notes}
                  onNotesChange={handleNotesChange}
                />
              )}
            </div>
          </div>

          {/* Completion Modal */}
          {showCompletionModal && currentProblem && (
            <CompletionModal
              problemName={currentProblem.name}
              onSolved={handleSolved}
              onKeepWorking={handleKeepWorking}
            />
          )}
        </>
      )}
    </div>
  );
}
