import { VALIDATION_RULES } from '@/utils/constants/validation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPasswordChecks(password = '') {
  return {
    minLength: password.length >= VALIDATION_RULES.PASSWORD.minLength,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };
}

export function validateRegisterForm(values) {
  const fieldErrors = {};

  if (!values.fullName?.trim()) {
    fieldErrors.fullName = VALIDATION_RULES.FULL_NAME.message;
  }

  if (!values.email?.trim()) {
    fieldErrors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    fieldErrors.email = VALIDATION_RULES.EMAIL.invalidMessage;
  }

  if (!values.password) {
    fieldErrors.password = 'Password is required';
  } else {
    const checks = getPasswordChecks(values.password);

    if (!checks.minLength) {
      fieldErrors.password = VALIDATION_RULES.PASSWORD.minLengthMessage;
    } else if (!checks.uppercase) {
      fieldErrors.password = VALIDATION_RULES.PASSWORD.uppercaseMessage;
    } else if (!checks.number) {
      fieldErrors.password = VALIDATION_RULES.PASSWORD.numberMessage;
    }
  }

  return fieldErrors;
}

export function hasValidationErrors(fieldErrors) {
  return Object.keys(fieldErrors).length > 0;
}
