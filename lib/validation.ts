/**
 * Validation Helper Functions
 * 
 * Provides validation utilities for common data types used in the application
 */

/**
 * Validates UUID format (RFC 4122)
 * Format: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
 */
export function validateUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates monetary amount
 * - Must be positive
 * - Maximum 2 decimal places
 */
export function validateAmount(amount: number): boolean {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return false;
  }
  
  if (amount <= 0) {
    return false;
  }
  
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

/**
 * Validates ISO 8601 date format
 */
export function validateDate(date: string): boolean {
  if (!date || typeof date !== 'string') {
    return false;
  }
  
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!iso8601Regex.test(date)) {
    return false;
  }
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Validates email format (RFC 5322 simplified)
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (E.164 format)
 * Format: +[country code][number]
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Validates payment reference format
 * - Alphanumeric only
 * - 10-50 characters
 */
export function validatePaymentReference(ref: string): boolean {
  if (!ref || typeof ref !== 'string') {
    return false;
  }
  
  const paymentRefRegex = /^[a-zA-Z0-9]{10,50}$/;
  return paymentRefRegex.test(ref);
}
