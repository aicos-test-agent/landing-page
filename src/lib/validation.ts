// Shared validation constants and utilities

// RFC 5322 official regex for email validation
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Max lengths
export const MAX_NAME_LENGTH = 100;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_EMAIL_LENGTH = 254; // RFC 5322

// Validate email format and length
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email);
}

// Validate name length
export function isValidName(name: string | undefined): boolean {
  if (name === undefined || name === null) return true; // name is optional
  if (typeof name !== 'string') return false;
  return name.length <= MAX_NAME_LENGTH;
}

// Validate message length
export function isValidMessage(message: string | undefined): boolean {
  if (!message || typeof message !== 'string') return false;
  return message.length <= MAX_MESSAGE_LENGTH;
}
