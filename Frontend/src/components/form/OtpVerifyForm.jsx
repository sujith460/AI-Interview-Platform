import { useRef, useState, useEffect, useCallback } from 'react';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';

/** Format seconds as MM:SS countdown */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function OtpVerifyForm({
  email,
  otpError,
  successMessage,
  apiError,
  isLoading,
  otpSecondsLeft,
  onVerifyOtp,
  onResendOtp,
  onBackToForm,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Auto-focus the first empty box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = useCallback(
    (index, value) => {
      // Accept only single digits
      const digit = value.replace(/\D/g, '').slice(-1);
      const next = [...digits];
      next[index] = digit;
      setDigits(next);

      // Auto-advance to next input
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 digits are filled
      if (digit && index === 5) {
        const fullCode = [...next.slice(0, 5), digit].join('');
        if (fullCode.length === 6) {
          onVerifyOtp(fullCode);
        }
      }
    },
    [digits, onVerifyOtp]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace') {
        if (digits[index]) {
          // Clear current
          const next = [...digits];
          next[index] = '';
          setDigits(next);
        } else if (index > 0) {
          // Move back
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === 'Enter') {
        const code = digits.join('');
        if (code.length === 6) onVerifyOtp(code);
      }
    },
    [digits, onVerifyOtp]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasted) return;
      const next = [...digits];
      pasted.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
      setDigits(next);
      // Focus the last filled or next empty box
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
      if (pasted.length === 6) {
        onVerifyOtp(pasted);
      }
    },
    [digits, onVerifyOtp]
  );

  const handleVerifyClick = useCallback(() => {
    onVerifyOtp(digits.join(''));
  }, [digits, onVerifyOtp]);

  const expired = otpSecondsLeft === 0;
  const filled = digits.every((d) => d !== '');

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/40 sm:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-900/30 dark:shadow-violet-900/50">
          <MailCheckIcon />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We sent a 6-digit code to
        </p>
        <p className="mt-0.5 text-sm font-semibold text-violet-600 dark:text-violet-400 break-all">
          {email}
        </p>
      </div>

      {/* Alerts */}
      {apiError && <Alert variant="error" className="mb-5">{apiError}</Alert>}
      {successMessage && <Alert variant="success" className="mb-5">{successMessage}</Alert>}

      {/* OTP digit inputs */}
      <div className="flex justify-center gap-3 mb-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            id={`otp-digit-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={[
              'h-14 w-12 rounded-xl border-2 text-center text-xl font-bold transition-all duration-150 outline-none',
              'bg-white dark:bg-white/5',
              'text-slate-900 dark:text-white',
              otpError
                ? 'border-red-400 dark:border-red-500 focus:border-red-400'
                : digit
                ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-200 dark:shadow-violet-900/30'
                : 'border-slate-200 dark:border-white/10 focus:border-violet-400 dark:focus:border-violet-500',
            ].join(' ')}
            aria-label={`Digit ${i + 1}`}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* OTP Error */}
      {otpError && (
        <p className="mb-4 text-center text-xs text-red-500 dark:text-red-400 leading-snug">
          {otpError}
        </p>
      )}

      {/* Countdown timer */}
      <div className="mb-6 text-center">
        {expired ? (
          <p className="text-sm text-red-500 dark:text-red-400 font-medium">
            Code expired
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Code expires in{' '}
            <span
              className={`font-semibold tabular-nums ${
                otpSecondsLeft <= 60
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-violet-600 dark:text-violet-400'
              }`}
            >
              {formatTime(otpSecondsLeft)}
            </span>
          </p>
        )}
      </div>

      {/* Verify button */}
      <Button
        type="button"
        className="w-full mb-4"
        isLoading={isLoading}
        disabled={!filled || isLoading}
        onClick={handleVerifyClick}
      >
        {isLoading ? 'Verifying...' : 'Verify & Create Account'}
      </Button>

      {/* Resend */}
      <div className="text-center mb-4">
        {expired ? (
          <button
            type="button"
            onClick={onResendOtp}
            disabled={isLoading}
            className="text-sm font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 disabled:opacity-50 transition-colors"
          >
            Resend verification code
          </button>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Didn&apos;t receive a code?{' '}
            <span className="text-slate-400 dark:text-slate-500">
              Wait {formatTime(otpSecondsLeft)} to resend
            </span>
          </p>
        )}
      </div>

      {/* Back */}
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToForm}
          disabled={isLoading}
          className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5 mx-auto"
        >
          <BackIcon />
          Use a different email address
        </button>
      </div>
    </div>
  );
}

function MailCheckIcon() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}
