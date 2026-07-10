"""
Feedback context for managing user feedback and notifications.
Provides a centralized way to handle success, error, and info messages.
"""
import { createContext, useContext, useState, useCallback } from 'react';

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message, type = 'info', duration = 5000) => {
    setFeedback({ message, type, duration });
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedback, showFeedback, hideFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
}