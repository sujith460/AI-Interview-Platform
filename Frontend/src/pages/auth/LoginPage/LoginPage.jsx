import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import LoginForm from '@/components/form/LoginForm';
import useLogin from '@/hooks/auth/useLogin';

export default function LoginPage() {
  const loginState = useLogin();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your interview preparation journey."
    >
      <LoginForm {...loginState} />
    </AuthLayout>
  );
}
