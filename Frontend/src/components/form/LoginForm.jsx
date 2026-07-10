import { Link } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import IconInput, { MailIcon } from '@/components/ui/input/IconInput';
import PasswordInput from '@/components/ui/input/PasswordInput';

export default function LoginForm({
  values,
  fieldErrors,
  apiError,
  isLoading,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
  onGoogleSignIn,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <IconInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email address"
        icon={MailIcon}
        value={values.email}
        onChange={onChange}
        error={fieldErrors.email}
        autoComplete="email"
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="Enter your password"
        value={values.password}
        onChange={onChange}
        error={fieldErrors.password}
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between gap-4 py-1">
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-white/10 dark:bg-slate-900/50"
          />
          <span>Remember me</span>
        </label>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="text-sm font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
        {!isLoading && <ArrowRightIcon />}
      </Button>

      <div className="relative flex items-center py-1">
        <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
        <span className="px-4 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
          or
        </span>
        <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onGoogleSignIn}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
