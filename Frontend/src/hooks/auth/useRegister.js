import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseApiError } from '@/api/types/apiError';
import { registerUser } from '@/services/auth/authService';
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

export default function useRegister() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = useMemo(
    () => getPasswordChecks(values.password),
    [values.password]
  );

  const clearMessages = useCallback(() => {
    setApiError('');
    setSuccessMessage('');
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setValues((previous) => ({
        ...previous,
        [name]: value,
      }));

      setFieldErrors((previous) => ({
        ...previous,
        [name]: '',
      }));

      clearMessages();
    },
    [clearMessages]
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((previous) => !previous);
  }, []);

  const handleGoogleSignUp = useCallback(() => {
    setApiError('');
    setSuccessMessage('');
    setApiError('Google sign-up will be available soon.');
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      clearMessages();

      const validationErrors = validateRegisterForm(values);
      setFieldErrors(validationErrors);

      if (hasValidationErrors(validationErrors)) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await registerUser({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
        });

        setSuccessMessage(
          response.message || 'User registered successfully. Redirecting to login...'
        );

        setTimeout(() => {
          navigate('/login');
        }, REGISTER_SUCCESS_REDIRECT_MS);
      } catch (error) {
        const parsedError = parseApiError(error);
        setApiError(parsedError.message);
        setFieldErrors((previous) => ({
          ...previous,
          ...parsedError.fieldErrors,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [clearMessages, navigate, values]
  );

  return {
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
  };
}
