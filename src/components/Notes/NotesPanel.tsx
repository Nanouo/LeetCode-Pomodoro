// Notes Panel Component - Side panel for taking notes during timer
import { useState, useEffect } from 'react';

interface NotesPanelProps {
  problemName: string;
  difficulty: string;
  initialNotes?: string;
  onNotesChange?: (notes: string) => void;
}

export default function NotesPanel({
  problemName,
  difficulty,
  initialNotes = '',
  onNotesChange,
}: NotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);

  // Update notes when initialNotes changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange?.(newNotes);
  };

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-leetcode-easy text-white';
      case 'Medium':
        return 'bg-leetcode-medium text-gray-900';
      case 'Hard':
        return 'bg-leetcode-hard text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {problemName}
        </h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
          {difficulty}
        </span>
      </div>

      {/* Notes textarea */}
      <div className="flex-1 flex flex-col">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Take notes about your approach, ideas, or learnings..."
          className="flex-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-leetcode-easy focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
        />
        
        {/* Character count */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          {notes.length} characters
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        💾 Notes auto-save every 30 seconds
      </div>
    </div>
  );
}
