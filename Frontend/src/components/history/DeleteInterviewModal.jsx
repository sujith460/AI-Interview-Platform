import React, { useState } from 'react';
import Modal from '@/components/ui/modal/Modal';
import Button from '@/components/ui/button/Button';
import Spinner from '@/components/ui/spinner/Spinner';
import { deleteInterviewSession } from '@/services/interview/interviewService';

export default function DeleteInterviewModal({ isOpen, onClose, session, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !session) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteInterviewSession(session.sessionId);
      onDeleteSuccess(session.sessionId);
      onClose();
    } catch (err) {
      console.error('Failed to delete session', err);
      setError('Failed to delete interview session. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center space-y-4 py-2">
        {/* Warning Trash Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Interview Session</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete your mock interview session with{' '}
            <span className="font-semibold text-slate-200">{session.companyName}</span> ({session.role || 'Software Engineer'})?
            This action is permanent and cannot be undone.
          </p>
        </div>

        {error && <div className="text-xs text-rose-400">{error}</div>}

        <div className="mt-6 flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="w-1/2"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-1/2 h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-md shadow-rose-900/30 disabled:opacity-50"
          >
            {isDeleting ? <Spinner className="h-4 w-4 border-white" /> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
