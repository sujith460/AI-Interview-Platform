import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseApiError } from '@/api/types/apiError';
import { registerUser, sendOtp } from '@/services/auth/authService';
import { REGISTER_SUCCESS_REDIRECT_MS } from '@/utils/constants/validation';
import {
  getPasswordChecks,
  hasValidationErrors,
  validateRegisterForm,
} from '@/utils/validators/registerValidators';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  password: '',
};

/** OTP expires after 10 minutes — matches backend TTL */
const OTP_TTL_SECONDS = 10 * 60;

export default function useRegister() {
  const navigate = useNavigate();

  // ── Step state: 'form' | 'otp' ──────────────────────────────────────────
  const [step, setStep] = useState('form');

  // ── Form values & UI state ───────────────────────────────────────────────
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── OTP state ────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_TTL_SECONDS);
  const [otpTimerRef, setOtpTimerRef] = useState(null);

  const passwordChecks = useMemo(
    () => getPasswordChecks(values.password),
    [values.password]
  );

  const clearMessages = useCallback(() => {
    setApiError('');
    setSuccessMessage('');
  }, []);

  // ── Form field change ────────────────────────────────────────────────────
  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
      clearMessages();
    },
    [clearMessages]
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoogleSignUp = useCallback(() => {
    setApiError('Google sign-up will be available soon.');
  }, []);

  // ── Start/reset the countdown timer ─────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (otpTimerRef) clearInterval(otpTimerRef);
    setOtpSecondsLeft(OTP_TTL_SECONDS);

    const id = setInterval(() => {
      setOtpSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    setOtpTimerRef(id);
  }, [otpTimerRef]);

  // ── Step 1: Submit registration form → send OTP ──────────────────────────
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      clearMessages();

      const validationErrors = validateRegisterForm(values);
      setFieldErrors(validationErrors);
      if (hasValidationErrors(validationErrors)) return;

      setIsLoading(true);
      try {
        await sendOtp(values.email.trim());
        // OTP sent successfully — move to verification screen
        setStep('otp');
        setOtp('');
        setOtpError('');
        startCountdown();
      } catch (error) {
        const parsedError = parseApiError(error);
        const msg = parsedError.message || 'Failed to send verification code.';

        // Pin email-related errors under the email field
        const isEmailError =
          msg.toLowerCase().includes('email') ||
          msg.toLowerCase().includes('mailbox') ||
          msg.toLowerCase().includes('deliver');

        if (isEmailError) {
          setFieldErrors((prev) => ({ ...prev, email: msg }));
        } else {
          setApiError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [clearMessages, startCountdown, values]
  );

  // ── Step 2: Verify OTP and complete registration ─────────────────────────
  const handleVerifyOtp = useCallback(
    async (submittedOtp) => {
      const code = submittedOtp ?? otp;
      if (!code || code.length !== 6) {
        setOtpError('Please enter all 6 digits.');
        return;
      }
      setOtpError('');
      setIsLoading(true);

      try {
        const response = await registerUser({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
          otp: code,
        });

        setSuccessMessage(
          response.message || 'Account created! Redirecting to login...'
        );

        setTimeout(() => {
          navigate('/login');
        }, REGISTER_SUCCESS_REDIRECT_MS);
      } catch (error) {
        const parsedError = parseApiError(error);
        const msg = parsedError.message || 'Verification failed. Please try again.';

        // OTP-specific errors go to the otp error display
        const isOtpError =
          msg.toLowerCase().includes('code') ||
          msg.toLowerCase().includes('otp') ||
          msg.toLowerCase().includes('verif') ||
          msg.toLowerCase().includes('expired');

        if (isOtpError) {
          setOtpError(msg);
        } else {
          setApiError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, otp, values]
  );

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResendOtp = useCallback(async () => {
    if (otpSecondsLeft > 0) return; // Still counting down

    setOtpError('');
    setIsLoading(true);
    try {
      await sendOtp(values.email.trim());
      setOtp('');
      startCountdown();
      setSuccessMessage('A new verification code has been sent.');
    } catch (error) {
      const parsedError = parseApiError(error);
      setOtpError(parsedError.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [otpSecondsLeft, startCountdown, values.email]);

  // ── Go back to form ──────────────────────────────────────────────────────
  const handleBackToForm = useCallback(() => {
    if (otpTimerRef) clearInterval(otpTimerRef);
    setStep('form');
    setOtp('');
    setOtpError('');
    clearMessages();
  }, [clearMessages, otpTimerRef]);

  return {
    // Step
    step,

    // Form
    values,
    fieldErrors,
    apiError,
    successMessage,
    isLoading,
    showPassword,
    passwordChecks,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onTogglePassword: handleTogglePassword,
    onGoogleSignUp: handleGoogleSignUp,

    // OTP
    otp,
    setOtp,
    otpError,
    otpSecondsLeft,
    onVerifyOtp: handleVerifyOtp,
    onResendOtp: handleResendOtp,
    onBackToForm: handleBackToForm,
  };
}
