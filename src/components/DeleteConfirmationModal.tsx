import { motion } from 'framer-motion';

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-cyber text-2xl text-red-500">
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {message}
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-cyber text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scoreboard-dark-bg rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-cyber bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteConfirmationModal; 
