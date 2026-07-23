import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import PracticeListPage from '@/pages/practice/PracticeListPage';
import PracticeWorkspacePage from '@/pages/practice/PracticeWorkspacePage';
import InterviewSetupPage from '@/pages/interview/InterviewSetupPage';
import InterviewRoomPage from '@/pages/interview/InterviewRoomPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice/:slug"
        element={
          <ProtectedRoute>
            <PracticeWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/start"
        element={
          <ProtectedRoute>
            <InterviewSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:sessionId"
        element={
          <ProtectedRoute>
            <InterviewRoomPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}
