/**
 * Date utility functions for consistent timezone handling across the app
 */

/**
 * Converts a date string (YYYY-MM-DD) to a Date object at midnight UTC
 * This ensures consistent date handling regardless of timezone
 */
export const parseDateStringToUTC = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Create date at midnight UTC to avoid timezone shifts
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
};

/**
 * Converts a Date object to a date string (YYYY-MM-DD) in UTC
 * This ensures consistent date formatting regardless of local timezone
 */
export const formatDateToUTCString = (date: Date): string => {
  if (!date || isNaN(date.getTime())) return '';

  return date.toISOString().split('T')[0];
};

/**
 * Gets today's date as a UTC date string (YYYY-MM-DD)
 */
export const getTodayUTCString = (): string => {
  return formatDateToUTCString(new Date());
};

/**
 * Gets today's date as a UTC Date object at midnight
 */
export const getTodayUTC = (): Date => {
  return parseDateStringToUTC(getTodayUTCString());
};

/**
 * Checks if two date strings represent the same date (ignoring time)
 */
export const isSameDate = (dateString1: string, dateString2: string): boolean => {
  if (!dateString1 || !dateString2) return false;
  return dateString1 === dateString2;
};

/**
 * Converts a date string to a user-friendly display format
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';

  const date = parseDateStringToUTC(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Use UTC to avoid local timezone shifts
  });
};
