import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import Input from '@/components/ui/input/Input';
import Spinner from '@/components/ui/spinner/Spinner';
import ThemeToggle from '@/components/common/ThemeToggle';
import useProfile from '@/hooks/profile/useProfile';
import { TOKEN_KEY } from '@/utils/constants/auth';
import { cn } from '@/utils/helpers/cn';

export default function ProfilePage() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const {
    profile,
    formValues,
    initials,
    isLoading,
    isSaving,
    fieldErrors,
    apiError,
    successMessage,
    isEditMode,
    avatarImage,
    resumeFile,
    completionPercent,
    suggestions,
    setIsEditMode,
    onChange,
    onSubmit,
    onCancel,
    onAvatarUpload,
    onResumeUpload,
    onResumeDelete,
    refetch,
  } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  const triggerAvatarUpload = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const triggerResumeUpload = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.click();
    }
  };

  return (
    <div className="register-grid relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070714] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-register-glow opacity-60 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10" />

      {/* Hidden Inputs for File Uploads */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={(e) => onAvatarUpload(e.target.files[0])}
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
      />
      <input
        type="file"
        ref={resumeInputRef}
        onChange={(e) => onResumeUpload(e.target.files[0])}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-[#070714]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-xs font-bold text-white shadow-lg shadow-violet-900/40 transition-transform hover:scale-105 active:scale-95"
            >
              AI
            </button>
            <span className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              Settings & Profile
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && apiError && !profile && (
          <div className="mx-auto max-w-lg animate-slide-up">
            <Alert variant="error">{apiError}</Alert>
            <Button variant="outline" className="mt-4 w-full" onClick={refetch}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !apiError && profile && (
          <div className="animate-fade-in space-y-8">
            {apiError && <Alert variant="error">{apiError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-10">
              {/* Profile Header & Info Overview Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-12 lg:self-start">
                <ProfileHeaderCard
                  initials={initials}
                  avatarImage={avatarImage}
                  fullName={profile.fullName}
                  email={profile.email}
                  targetRole={formValues.targetRole}
                  onAvatarClick={triggerAvatarUpload}
                />

                <CompletionCard
                  percent={completionPercent}
                  suggestions={suggestions}
                />
              </div>

              {/* Form Content / Profile Details */}
              <div className="min-w-0 space-y-8">
                <form onSubmit={onSubmit} noValidate className="space-y-8">
                  <ProfessionalInformationSection
                    values={formValues}
                    errors={fieldErrors}
                    isEditMode={isEditMode}
                    onChange={onChange}
                  />

                  <ProfessionalLinksSection
                    values={formValues}
                    errors={fieldErrors}
                    isEditMode={isEditMode}
                    onChange={onChange}
                  />

                  <ResumeSection
                    resumeFile={resumeFile}
                    resumeUrl={formValues.resumeUrl}
                    isEditMode={isEditMode}
                    onUploadClick={triggerResumeUpload}
                    onDeleteClick={onResumeDelete}
                  />

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-white/50 p-4 backdrop-blur-md dark:border-white/5 dark:bg-white/[0.02] sm:px-6">
                    <div>
                      {!isEditMode && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Click "Edit Profile" to modify your developer settings.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditMode ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSaving}
                            className="min-w-[100px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            isLoading={isSaving}
                            disabled={isSaving}
                            className="min-w-[160px]"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                            {!isSaving && <SaveIcon />}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setIsEditMode(true)}
                          className="min-w-[140px]"
                        >
                          Edit Profile
                          <EditIcon />
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Profile Header Card ─── */

function ProfileHeaderCard({ initials, avatarImage, fullName, email, targetRole, onAvatarClick }) {
  return (
    <Card className="relative overflow-hidden p-6 text-center sm:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20" />

      <div className="relative">
        <div className="mx-auto mb-5 flex justify-center">
          <button
            onClick={onAvatarClick}
            type="button"
            className="group relative focus:outline-none"
            aria-label="Upload profile image"
          >
            {avatarImage ? (
              <img
                src={avatarImage}
                alt={fullName}
                className="h-24 w-24 rounded-3xl object-cover shadow-lg shadow-violet-900/30 ring-2 ring-violet-500/20 transition-all duration-300 group-hover:scale-105 group-hover:ring-violet-500 sm:h-28 sm:w-28"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 text-3xl font-bold text-white shadow-lg shadow-violet-900/30 transition-transform group-hover:scale-105 sm:h-28 sm:w-28 sm:text-4xl">
                {initials}
              </div>
            )}
            {/* Click to edit overlay */}
            <div className="absolute -inset-0.5 rounded-3xl bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{fullName}</h2>
        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1 uppercase tracking-wider">
          {targetRole || 'Developer'}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{email}</p>

        <div className="mt-6 border-t border-slate-200/60 pt-5 dark:border-white/5">
          <div className="space-y-3 text-left">
            <ProfileInfoRow label="Name" value={fullName} />
            <ProfileInfoRow label="Email" value={email} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProfileInfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

/* ─── Profile Completion Card ─── */

function CompletionCard({ percent, suggestions }) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center">
        <span>Profile Completion</span>
        <span className="text-violet-600 dark:text-violet-400 font-extrabold">{percent}%</span>
      </h3>
      {/* Progress bar */}
      <div className="mt-3 h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-5 border-t border-slate-200/60 pt-4 dark:border-white/5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggestions</p>
          <ul className="space-y-2">
            {suggestions.slice(0, 3).map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-violet-600 dark:text-violet-400 mt-0.5">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/* ─── Professional Information Section ─── */

function ProfessionalInformationSection({ values, errors, isEditMode, onChange }) {
  return (
    <SectionCard
      title="Professional Information"
      description="Update your professional background, skills and experience level."
    >
      <div className="space-y-5">
        {isEditMode ? (
          <>
            {/* Bio */}
            <div>
              <Input
                id="bio"
                name="bio"
                label="Bio"
                placeholder="Tell us about yourself..."
                value={values.bio}
                onChange={onChange}
                error={errors.bio}
                as="textarea"
                className="min-h-[100px] resize-y"
                rows={3}
              />
              <CharCount current={values.bio?.length ?? 0} max={500} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="targetRole"
                name="targetRole"
                label="Target Role"
                placeholder="e.g., Senior Frontend Engineer"
                value={values.targetRole}
                onChange={onChange}
                error={errors.targetRole}
              />
              <Input
                id="experience"
                name="experience"
                label="Years of Experience"
                type="number"
                placeholder="e.g., 5"
                min="0"
                max="99"
                value={values.experience}
                onChange={onChange}
                error={errors.experience}
              />
            </div>

            {/* Skills */}
            <div>
              <Input
                id="skills"
                name="skills"
                label="Skills"
                placeholder="React, Node.js, Python, AWS, ..."
                value={values.skills}
                onChange={onChange}
                error={errors.skills}
                as="textarea"
                className="min-h-[80px] resize-y"
                rows={2}
              />
              <CharCount current={values.skills?.length ?? 0} max={1000} />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Role</p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {values.targetRole || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Years of Experience</p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {values.experience !== '' ? `${values.experience} years` : 'Not specified'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {values.bio || 'Add a bio to tell recruiters about yourself.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills</p>
              {values.skills ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {values.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-800 dark:text-violet-300 px-2.5 py-1 text-xs font-semibold tracking-wide"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No skills listed yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Professional Links Section ─── */

function ProfessionalLinksSection({ values, errors, isEditMode, onChange }) {
  const links = [
    {
      id: 'githubUrl',
      label: 'GitHub URL',
      placeholder: 'https://github.com/username',
      icon: GithubIcon,
      value: values.githubUrl,
    },
    {
      id: 'leetcodeUrl',
      label: 'LeetCode URL',
      placeholder: 'https://leetcode.com/u/username',
      icon: LeetCodeIcon,
      value: values.leetcodeUrl,
    },
    {
      id: 'linkedinUrl',
      label: 'LinkedIn URL',
      placeholder: 'https://linkedin.com/in/username',
      icon: LinkedInIcon,
      value: values.linkedinUrl,
    },
  ];

  return (
    <SectionCard
      title="Professional Links"
      description="Add links to your developer profiles to showcase your works."
    >
      <div className="space-y-4">
        {isEditMode ? (
          links.map(({ id, label, placeholder, icon: Icon }) => (
            <div key={id} className="relative">
              <Input
                id={id}
                name={id}
                label={label}
                type="url"
                placeholder={placeholder}
                value={values[id]}
                onChange={onChange}
                error={errors[id]}
              />
              <div className="pointer-events-none absolute right-3.5 top-[38px] text-slate-400">
                <Icon />
              </div>
            </div>
          ))
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {links.map(({ id, label, value, icon: Icon }) => (
              <a
                key={id}
                href={value || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border transition-all duration-300',
                  value
                    ? 'border-slate-200/80 bg-white/50 text-slate-800 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-200 hover:-translate-y-0.5 hover:border-violet-500/30'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400 dark:border-white/[0.02] dark:bg-white/[0.01] cursor-not-allowed'
                )}
              >
                <div className={cn('p-2 rounded-lg bg-slate-100 dark:bg-white/5', value && 'text-violet-600 dark:text-violet-400')}>
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-medium truncate mt-0.5">
                    {value ? value.replace(/^https?:\/\/(www\.)?/, '') : 'Not added'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Resume Upload Section ─── */

function ResumeSection({ resumeFile, resumeUrl, isEditMode, onUploadClick, onDeleteClick }) {
  return (
    <SectionCard
      title="Resume"
      description="Upload your latest PDF/DOC resume for quick analysis by interviewers."
    >
      <div className="space-y-4">
        {resumeFile ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:border-emerald-500/10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ResumeIcon />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{resumeFile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Size: {resumeFile.size} • Uploaded: {resumeFile.uploadedAt}
                </p>
              </div>
            </div>
            {isEditMode && (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={onUploadClick}>
                  Replace
                </Button>
                <button
                  type="button"
                  onClick={onDeleteClick}
                  className="text-xs font-bold text-red-500 hover:text-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : resumeUrl ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 dark:border-violet-500/10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 shrink-0">
                <ResumeIcon />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Resume Linked</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px] sm:max-w-none">
                  {resumeUrl}
                </p>
              </div>
            </div>
            {isEditMode && (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={onUploadClick}>
                  Upload File
                </Button>
                <button
                  type="button"
                  onClick={onDeleteClick}
                  className="text-xs font-bold text-red-500 hover:text-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={isEditMode ? onUploadClick : undefined}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300',
              isEditMode
                ? 'border-slate-300 dark:border-white/10 hover:border-violet-500 bg-white/40 dark:bg-white/[0.01] hover:bg-violet-500/[0.02] cursor-pointer'
                : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]'
            )}
          >
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 mb-3">
              <ResumeIcon />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isEditMode ? 'Click to upload your resume' : 'No resume uploaded'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
              {isEditMode
                ? 'Select a PDF, DOC, or DOCX file (max 5MB).'
                : 'Enter edit mode to upload a resume file.'}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ─── Reusable Section Card ─── */

function SectionCard({ title, description, children }) {
  return (
    <Card className="overflow-hidden p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </Card>
  );
}

/* ─── Character Count ─── */

function CharCount({ current, max }) {
  const isOver = current > max;
  return (
    <p
      className={cn(
        'mt-1.5 text-right text-xs',
        isOver
          ? 'font-medium text-red-500 dark:text-red-400'
          : 'text-slate-400 dark:text-slate-500'
      )}
    >
      {current}/{max}
    </p>
  );
}

/* ─── Loading Skeleton ─── */

function LoadingSkeleton() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-10">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-28 sm:w-28" />
            <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 w-full space-y-3 border-t border-slate-200/60 pt-5 dark:border-white/5">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 sm:p-8">
              <div className="mb-6 space-y-2">
                <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-72 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="space-y-4">
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */

function SaveIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-4 w-4 ml-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.16L9.13 8.114c1.058-1.134 3.204-1.027 4.295.216l1.356 1.54c.25.282.598.44.967.44h7.428c.946 0 1.537-.674 1.516-1.382a1.34 1.34 0 0 0-.147-.543c-.224-.449-.66-.751-1.157-.751h-6.547l-1.106-1.244a5.224 5.224 0 0 0-3.411-1.736z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 13.5h7.5m-7.5 3h3.75m-7.5-6h3.75m1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H12.75a.375.375 0 0 1-.375-.375Z" />
    </svg>
  );
}


