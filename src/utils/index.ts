/**
 * Generates a unique ID using timestamp and random string
 * @returns {string} A unique identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Formats a number as currency
 * @param {number} value - The number to format
 * @returns {string} The formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

/**
 * Formats a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Gets the correct path for an image, including the base URL in production
 * @param {string} path - The image path relative to the public directory
 * @returns {string} The complete image path
 */
export function getImagePath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
} 
