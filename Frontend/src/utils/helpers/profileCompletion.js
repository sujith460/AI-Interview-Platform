export function calculateProfileCompletion(user, profile, formValues = {}) {
  const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('profile_avatar') : null;
  const savedResume = typeof window !== 'undefined' ? localStorage.getItem('profile_resume') : null;

  const fields = [
    { value: user?.fullName || profile?.fullName },
    { value: formValues?.bio || profile?.bio },
    { value: formValues?.targetRole || profile?.targetRole },
    { value: formValues?.skills || profile?.skills },
    { value: formValues?.githubUrl || profile?.githubUrl },
    { value: formValues?.linkedinUrl || profile?.linkedinUrl },
    { value: formValues?.leetcodeUrl || profile?.leetcodeUrl },
    { value: formValues?.resumeUrl || profile?.resumeUrl || savedResume },
    { value: savedAvatar },
  ];

  const filled = fields.filter((f) => {
    if (typeof f.value === 'string') return f.value.trim() !== '';
    return !!f.value;
  });

  return Math.round((filled.length / fields.length) * 100);
}
