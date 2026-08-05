import { VALIDATION_RULES } from '@/utils/constants/validation';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DISALLOWED_DOMAINS = ['test.com', 'example.com', 'fake.com', 'abc.com', 'temp.com', 'foo.bar', 'xyz.com'];

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

  const emailVal = values.email?.trim().toLowerCase() || '';
  const emailDomain = emailVal.includes('@') ? emailVal.split('@')[1] : '';

  if (!emailVal) {
    fieldErrors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(emailVal) || DISALLOWED_DOMAINS.includes(emailDomain)) {
    fieldErrors.email = 'Please enter a valid, existing email address (e.g. user@gmail.com).';
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
