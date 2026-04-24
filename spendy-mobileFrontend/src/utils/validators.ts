export const isEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export function getAuthError(fields: { name?: string; email: string; password: string }) {
  if (fields.name !== undefined && !fields.name.trim()) return "Name is required.";
  if (!fields.email.trim()) return "Email is required.";
  if (!isEmail(fields.email)) return "Enter a valid email address.";
  if (fields.password.length < 6) return "Password must be at least 6 characters.";
  return "";
}