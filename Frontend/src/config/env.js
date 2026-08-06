/** API base URL from environment — in production defaults to deployed Azure backend if env var is unset */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'https://ai-intervview-platform-f5eqfxg4afdpdngs.southindia-01.azurewebsites.net');
