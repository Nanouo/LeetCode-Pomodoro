// Completion Modal - Shows when timer ends
interface CompletionModalProps {
  problemName: string;
  onSolved: () => void;
  onKeepWorking: () => void;
}

export default function CompletionModal({
  problemName,
  onSolved,
  onKeepWorking,
}: CompletionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Time's Up!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Did you solve <span className="font-semibold">{problemName}</span>?
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSolved}
            className="w-full py-4 bg-[#00b8a3] text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-colors"
          >
            Yes, I solved it! 🎉
          </button>
          <button
            onClick={onKeepWorking}
            className="w-full py-4 bg-gray-600 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-colors"
          >
            No, keep working
          </button>
        </div>
      </div>
    </div>
  );
}
