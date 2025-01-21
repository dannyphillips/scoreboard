/**
 * Generates a unique ID using timestamp and random string
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}; 
