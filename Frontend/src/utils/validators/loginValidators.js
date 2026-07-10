import { VALIDATION_RULES } from '@/utils/constants/validation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values) {
  const fieldErrors = {};

  if (!values.email?.trim()) {
    fieldErrors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    fieldErrors.email = VALIDATION_RULES.EMAIL.invalidMessage;
  }

  if (!values.password) {
    fieldErrors.password = 'Password is required';
  }

  return fieldErrors;
}

export function hasValidationErrors(fieldErrors) {
  return Object.keys(fieldErrors).length > 0;
}
