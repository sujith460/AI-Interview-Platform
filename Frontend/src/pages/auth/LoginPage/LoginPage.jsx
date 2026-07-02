import { Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import Button from '@/components/ui/button/Button';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your interview preparation journey."
    >
      <div className="space-y-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Login will be available once the backend login API is implemented.
        </p>
        <Link to="/register">
          <Button variant="ghost" className="w-full">
            Back to registration
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
