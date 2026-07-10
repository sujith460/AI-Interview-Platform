import { Navigate } from 'react-router-dom';
import { TOKEN_KEY } from '@/utils/constants/auth';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
