export const VALIDATION_RULES = {
  FULL_NAME: {
    required: true,
    message: 'Full name is required',
  },
  EMAIL: {
    required: true,
    invalidMessage: 'Enter a valid email',
  },
  PASSWORD: {
    required: true,
    minLength: 8,
    minLengthMessage: 'Password must contain at least 8 characters',
    uppercaseMessage: 'Password must contain at least one uppercase letter',
    numberMessage: 'Password must contain at least one number',
  },
};

export const REGISTER_SUCCESS_REDIRECT_MS = 2000;
