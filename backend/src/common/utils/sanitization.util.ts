/**
 * Input Sanitization Utility
 * Prevents XSS attacks and sanitizes user input
 */

/**
 * HTML entities to escape
 */
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 * @param input - The string to escape
 * @returns Escaped string safe for HTML output
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return input;
  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Remove HTML tags from a string
 * @param input - The string to strip
 * @returns String without HTML tags
 */
export function stripHtmlTags(input: string): string {
  if (!input || typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize a string for safe database storage and display
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return input;
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize an email address
 * @param email - The email to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  // Basic sanitization
  let sanitized = sanitizeString(email).toLowerCase();
  
  // Remove any characters that shouldn't be in an email
  sanitized = sanitized.replace(/[^a-z0-9._%+-@]/g, '');
  
  // Basic email format validation
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize a phone number
 * @param phone - The phone number to sanitize
 * @returns Sanitized phone number (digits only with optional +)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Keep only digits and leading +
  const hasPlus = phone.startsWith('+');
  const digits = phone.replace(/\D/g, '');
  
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Sanitize a URL
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if potentially dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const sanitized = sanitizeString(url);
  
  // Block javascript: and data: URLs
  const lowerUrl = sanitized.toLowerCase();
  if (
    lowerUrl.startsWith('javascript:') ||
    lowerUrl.startsWith('data:') ||
    lowerUrl.startsWith('vbscript:')
  ) {
    return '';
  }
  
  // Only allow http, https, and relative URLs
  if (
    !lowerUrl.startsWith('http://') &&
    !lowerUrl.startsWith('https://') &&
    !lowerUrl.startsWith('/') &&
    !lowerUrl.startsWith('./')
  ) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize an object recursively
 * @param obj - The object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Validate and sanitize a UUID
 * @param uuid - The UUID to validate
 * @returns The UUID if valid, empty string otherwise
 */
export function sanitizeUuid(uuid: string): string {
  if (!uuid || typeof uuid !== 'string') return '';
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    return '';
  }
  
  return uuid.toLowerCase();
}

/**
 * Sanitize SQL-like input (prevent SQL injection patterns)
 * Note: This is a secondary defense - always use parameterized queries
 * @param input - The input to sanitize
 * @returns Sanitized input
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') return input;
  
  // Remove common SQL injection patterns
  let sanitized = input;
  
  // Remove SQL comments
  sanitized = sanitized.replace(/--/g, '');
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove semicolons (statement terminators)
  sanitized = sanitized.replace(/;/g, '');
  
  // Escape single quotes
  sanitized = sanitized.replace(/'/g, "''");
  
  return sanitized;
}

/**
 * Truncate a string to a maximum length
 * @param input - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncateString(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return input;
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength);
}

/**
 * NestJS Pipe for automatic input sanitization
 */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return sanitizeString(value);
    }
    
    if (typeof value === 'object' && value !== null) {
      return sanitizeObject(value);
    }
    
    return value;
  }
}
