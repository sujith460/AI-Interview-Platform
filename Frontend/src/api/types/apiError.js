/**
 * Normalizes Axios / Spring Boot error payloads into a consistent shape.
 */
export function parseApiError(error) {
  if (!error.response) {
    return {
      message: 'Unable to reach the server. Please check your connection.',
      fieldErrors: {},
    };
  }

  const { data, status } = error.response;

  if (!data) {
    return {
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }

  const fieldErrors = extractFieldErrors(data);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      message: data.message || 'Please fix the highlighted fields.',
      fieldErrors,
    };
  }

  if (data.message) {
    return {
      message: data.message,
      fieldErrors: {},
    };
  }

  if (status === 409) {
    return {
      message: 'This email is already registered.',
      fieldErrors: {},
    };
  }

  if (status === 401) {
    return {
      message: data.message || 'Invalid email or password.',
      fieldErrors: {},
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
    fieldErrors: {},
  };
}

function extractFieldErrors(data) {
  const fieldErrors = {};

  const errorList = data.errors || data.fieldErrors || data.violations;

  if (Array.isArray(errorList)) {
    errorList.forEach((item) => {
      const field = item.field || item.property || item.fieldName;
      const message =
        item.defaultMessage || item.message || item.title || 'Invalid value';

      if (field) {
        fieldErrors[field] = message;
      }
    });
  }

  return fieldErrors;
}
