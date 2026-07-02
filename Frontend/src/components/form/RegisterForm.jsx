import { Link } from 'react-router-dom';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import PasswordRequirements from '@/components/form/PasswordRequirements';
import IconInput, { MailIcon, UserIcon } from '@/components/ui/input/IconInput';
import PasswordInput from '@/components/ui/input/PasswordInput';

export default function RegisterForm({
  values,
  fieldErrors,
  apiError,
  successMessage,
  isLoading,
  showPassword,
  passwordChecks,
  onChange,
  onSubmit,
  onTogglePassword,
  onGoogleSignUp,
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/40 sm:p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-violet-900/30 dark:shadow-violet-900/50">
          <UserPlusIcon />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Start your journey to interview success
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {apiError && <Alert variant="error">{apiError}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <IconInput
          id="fullName"
          name="fullName"
          label="Full name"
          placeholder="Enter your full name"
          icon={UserIcon}
          value={values.fullName}
          onChange={onChange}
          error={fieldErrors.fullName}
          autoComplete="name"
        />

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

        <div className="space-y-3">
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Create a strong password"
            value={values.password}
            onChange={onChange}
            error={fieldErrors.password}
            showPassword={showPassword}
            onToggleVisibility={onTogglePassword}
            autoComplete="new-password"
          />
          <PasswordRequirements checks={passwordChecks} />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
          {!isLoading && <ArrowRightIcon />}
        </Button>

        <div className="relative flex items-center py-1">
          <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
          <span className="px-4 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">or</span>
          <div className="flex-1 border-t border-slate-200 dark:border-white/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onGoogleSignUp}
        >
          <GoogleIcon />
          Sign up with Google
        </Button>

        <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
            Privacy Policy
          </a>
          .
        </p>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 sm:hidden">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

function UserPlusIcon() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.125v-.966a8.25 8.25 0 0 1 7.5-8.206 8.25 8.25 0 0 1 7.5 8.206v.966" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
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
