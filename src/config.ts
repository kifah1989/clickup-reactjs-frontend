// Configuration shim for environment-controlled values
// Uses Vite's import.meta.env variables. Defaults to localhost when not provided.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3000";
