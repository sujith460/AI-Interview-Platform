import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseApiError } from '@/api/types/apiError';
import { loginUser } from '@/services/auth/authService';
import { validateLoginForm, hasValidationErrors } from '@/utils/validators/loginValidators';
import { TOKEN_KEY } from '@/utils/constants/auth';

const INITIAL_VALUES = {
  email: '',
  password: '',
};

export default function useLogin() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clearMessages = useCallback(() => {
    setApiError('');
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

  const handleGoogleSignIn = useCallback(() => {
    setApiError('Google sign-in will be available soon.');
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      clearMessages();

      const validationErrors = validateLoginForm(values);
      setFieldErrors(validationErrors);

      if (hasValidationErrors(validationErrors)) {
        return;
      }

      setIsLoading(true);

      // Clear any stale token so the axios interceptor doesn't send it
      // with the login request (an expired token causes a 500 on the filter).
      localStorage.removeItem(TOKEN_KEY);

      try {
        const response = await loginUser({
          email: values.email.trim(),
          password: values.password,
        });

        if (!response.token) {
          setApiError('Authentication succeeded, but no token was returned.');
          return;
        }

        localStorage.setItem(TOKEN_KEY, response.token);
        navigate('/dashboard');
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
    isLoading,
    showPassword,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onTogglePassword: handleTogglePassword,
    onGoogleSignIn: handleGoogleSignIn,
  };
}
