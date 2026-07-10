import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseApiError } from '@/api/types/apiError';
import { getProfile, updateProfile } from '@/services/profile/profileService';

const INITIAL_FORM_VALUES = {
  bio: '',
  targetRole: '',
  experience: '',
  skills: '',
  githubUrl: '',
  leetcodeUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
};

const URL_REGEX = /^https?:\/\/.+\..+/i;

function isValidUrl(value) {
  if (!value?.trim()) return true;
  return URL_REGEX.test(value.trim());
}

function validateProfile(values) {
  const errors = {};

  if (values.bio && values.bio.length > 500) {
    errors.bio = 'Bio must be 500 characters or fewer.';
  }

  if (values.skills && values.skills.length > 1000) {
    errors.skills = 'Skills must be 1000 characters or fewer.';
  }

  if (values.githubUrl && !isValidUrl(values.githubUrl)) {
    errors.githubUrl = 'Enter a valid URL (e.g., https://github.com/username).';
  }

  if (values.leetcodeUrl && !isValidUrl(values.leetcodeUrl)) {
    errors.leetcodeUrl = 'Enter a valid URL (e.g., https://leetcode.com/u/username).';
  }

  if (values.linkedinUrl && !isValidUrl(values.linkedinUrl)) {
    errors.linkedinUrl = 'Enter a valid URL (e.g., https://linkedin.com/in/username).';
  }

  if (values.resumeUrl && !isValidUrl(values.resumeUrl)) {
    errors.resumeUrl = 'Enter a valid URL.';
  }

  if (values.experience && (Number(values.experience) < 0 || Number(values.experience) > 99)) {
    errors.experience = 'Experience must be between 0 and 99 years.';
  }

  return errors;
}

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // New features: view/edit state and mock profile avatar/resume
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarImage, setAvatarImage] = useState(() => {
    return localStorage.getItem('profile_avatar') || null;
  });
  const [resumeFile, setResumeFile] = useState(() => {
    const saved = localStorage.getItem('profile_resume');
    return saved ? JSON.parse(saved) : null;
  });

  const clearMessages = useCallback(() => {
    setApiError('');
    setSuccessMessage('');
  }, []);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setApiError('');

    try {
      const data = await getProfile();
      setProfile(data);
      setFormValues({
        bio: data.bio ?? '',
        targetRole: data.targetRole ?? '',
        experience: data.experience?.toString() ?? '',
        skills: data.skills ?? '',
        githubUrl: data.githubUrl ?? '',
        leetcodeUrl: data.leetcodeUrl ?? '',
        linkedinUrl: data.linkedinUrl ?? '',
        resumeUrl: data.resumeUrl ?? '',
      });
    } catch (error) {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setFormValues((previous) => ({
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

  const handleCancel = useCallback(() => {
    if (profile) {
      setFormValues({
        bio: profile.bio ?? '',
        targetRole: profile.targetRole ?? '',
        experience: profile.experience?.toString() ?? '',
        skills: profile.skills ?? '',
        githubUrl: profile.githubUrl ?? '',
        leetcodeUrl: profile.leetcodeUrl ?? '',
        linkedinUrl: profile.linkedinUrl ?? '',
        resumeUrl: profile.resumeUrl ?? '',
      });
    }
    setFieldErrors({});
    clearMessages();
    setIsEditMode(false);
  }, [profile, clearMessages]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      clearMessages();

      const validationErrors = validateProfile(formValues);
      setFieldErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSaving(true);

      try {
        const payload = {
          bio: formValues.bio.trim() || null,
          targetRole: formValues.targetRole.trim() || null,
          experience: formValues.experience ? Number(formValues.experience) : null,
          skills: formValues.skills.trim() || null,
          githubUrl: formValues.githubUrl.trim() || null,
          leetcodeUrl: formValues.leetcodeUrl.trim() || null,
          linkedinUrl: formValues.linkedinUrl.trim() || null,
          resumeUrl: formValues.resumeUrl.trim() || null,
        };

        const updatedProfile = await updateProfile(payload);
        setProfile(updatedProfile);
        setSuccessMessage('Profile updated successfully.');
        setIsEditMode(false);
      } catch (error) {
        const parsed = parseApiError(error);
        setApiError(parsed.message);
        setFieldErrors((previous) => ({
          ...previous,
          ...parsed.fieldErrors,
        }));
      } finally {
        setIsSaving(false);
      }
    },
    [clearMessages, formValues]
  );

  const handleAvatarUpload = useCallback((file) => {
    if (!file) return;

    if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setApiError('Invalid image format. Supported formats: PNG, JPG, JPEG, WEBP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setApiError('Image file size exceeds the 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setAvatarImage(base64Data);
      localStorage.setItem('profile_avatar', base64Data);
      setSuccessMessage('Profile avatar uploaded successfully.');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleResumeUpload = useCallback((file) => {
    if (!file) return;

    // Support PDF, DOCX, DOC
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type)) {
      setApiError('Invalid file type. Supported formats: PDF, DOC, DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError('Resume file size exceeds the 5MB limit.');
      return;
    }

    const fileMeta = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadedAt: new Date().toLocaleDateString(),
    };

    setResumeFile(fileMeta);
    localStorage.setItem('profile_resume', JSON.stringify(fileMeta));

    // Update form values if we want to store a dummy URL
    setFormValues((prev) => ({
      ...prev,
      resumeUrl: 'https://placeholder-resume-url.pdf',
    }));
    setSuccessMessage('Resume uploaded successfully.');
  }, []);

  const handleResumeDelete = useCallback(() => {
    setResumeFile(null);
    localStorage.removeItem('profile_resume');
    setFormValues((prev) => ({
      ...prev,
      resumeUrl: '',
    }));
    setSuccessMessage('Resume deleted.');
  }, []);

  const initials = useMemo(() => {
    if (!profile?.fullName) return 'U';
    const nameParts = profile.fullName.trim().split(/\s+/);
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }, [profile?.fullName]);

  // Profile completion % calculation
  const completionData = useMemo(() => {
    const fields = [
      { key: 'fullName', label: 'Full Name', value: profile?.fullName },
      { key: 'bio', label: 'Bio', value: formValues.bio },
      { key: 'targetRole', label: 'Target Role', value: formValues.targetRole },
      { key: 'skills', label: 'Skills', value: formValues.skills },
      { key: 'githubUrl', label: 'GitHub URL', value: formValues.githubUrl, suggestion: 'Complete your GitHub profile' },
      { key: 'linkedinUrl', label: 'LinkedIn URL', value: formValues.linkedinUrl, suggestion: 'Add your LinkedIn profile' },
      { key: 'leetcodeUrl', label: 'LeetCode URL', value: formValues.leetcodeUrl, suggestion: 'Add your LeetCode profile' },
      { key: 'resumeUrl', label: 'Resume', value: formValues.resumeUrl || resumeFile, suggestion: 'Upload your resume' },
      { key: 'avatar', label: 'Profile Picture', value: avatarImage, suggestion: 'Upload a profile picture' },
    ];

    const filled = fields.filter((f) => {
      if (typeof f.value === 'string') return f.value.trim() !== '';
      return !!f.value;
    });

    const percent = Math.round((filled.length / fields.length) * 100);
    const suggestions = fields.filter((f) => !f.value && f.suggestion).map((f) => f.suggestion);

    return {
      percent,
      suggestions,
    };
  }, [profile, formValues, avatarImage, resumeFile]);

  return {
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
    completionPercent: completionData.percent,
    suggestions: completionData.suggestions,
    setIsEditMode,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onAvatarUpload: handleAvatarUpload,
    onResumeUpload: handleResumeUpload,
    onResumeDelete: handleResumeDelete,
    refetch: fetchProfile,
    clearMessages,
  };
}
