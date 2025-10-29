import { useState } from 'react';
import ProblemForm from './components/ProblemForm/ProblemForm';
import Timer from './components/Timer/Timer';
import NotesPanel from './components/Notes/NotesPanel';
import type { Difficulty } from './types';

function App() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<{
    name: string;
    difficulty: Difficulty;
  } | null>(null);
  const [notes, setNotes] = useState('');

  const handleStartSession = (problemName: string, difficulty: Difficulty) => {
    setCurrentProblem({ name: problemName, difficulty });
    setSessionStarted(true);
    setNotes(''); // Clear notes for new problem
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    // TODO: Auto-save to localStorage or Firebase
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            LeetCode Pomodoro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learning Companion
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!sessionStarted ? (
            // Show problem form before session starts
            <div className="max-w-2xl mx-auto">
              <ProblemForm onStartSession={handleStartSession} />
            </div>
          ) : (
            // Show timer + notes layout during session
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Timer */}
              <div>
                <Timer />
                <button
                  onClick={() => setSessionStarted(false)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default App
