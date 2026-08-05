import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSpeechRecognition - Custom React Hook for Candidate Speech-To-Text (STT)
 * Uses browser-native SpeechRecognition / webkitSpeechRecognition API.
 */
export default function useSpeechRecognition({ onResult, lang = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const shouldBeListeningRef = useRef(false);
  const onResultRef = useRef(onResult);

  // Always keep onResultRef updated to current callback without re-running effect
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript + ' ';
          } else {
            interimStr += res[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript((prev) => {
            const next = prev ? `${prev} ${finalStr.trim()}` : finalStr.trim();
            if (onResultRef.current) {
              onResultRef.current(next);
            }
            return next;
          });
        }
        setInterimTranscript(interimStr);
      };

      recognition.onerror = (evt) => {
        console.warn('Speech recognition error:', evt.error);
        if (evt.error === 'no-speech') return; // ignorable silent pause
        setError(evt.error);
        if (evt.error === 'not-allowed' || evt.error === 'service-not-allowed') {
          shouldBeListeningRef.current = false;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // If candidate intended to keep listening, auto restart continuous stream
        if (shouldBeListeningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Speech recognition already active or restarting
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        shouldBeListeningRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [lang]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    setError(null);
    shouldBeListeningRef.current = true;

    // Check & request microphone permission if needed
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr) {
      console.warn('Microphone permission check failed:', permErr);
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      // Already running or starting
      setIsListening(true);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

