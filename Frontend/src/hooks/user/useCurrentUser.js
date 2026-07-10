import { useCallback, useEffect, useState } from 'react';
import { parseApiError } from '@/api/types/apiError';
import { getCurrentUser } from '@/services/user/userService';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
