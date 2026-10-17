/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, the app uses the real API instead of mock data. */
  readonly VITE_API_BASE_URL?: string;
}
