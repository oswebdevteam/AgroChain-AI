/**
 * Property-Based Tests for Validation Functions
 */

import * as fc from 'fast-check';
import {
  validateUUID,
  validateAmount,
  validatePaymentReference,
  validateEmail,
  validatePhone,
  validateDate,
} from '@/lib/validation';

describe('Validation Property Tests', () => {
  /**
   * Property 28: UUID Format Validation
   * Validates: Requirements 13.1
   */
  describe('Property 28: UUID Format Validation', () => {
    it('should validate correct UUID format', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          (uuid) => {
            expect(validateUUID(uuid)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid UUID formats', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => !validateUUID(s)),
          (invalidUuid) => {
            expect(validateUUID(invalidUuid)).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 29: Monetary Amount Validation
   * Validates: Requirements 13.2
   */
  describe('Property 29: Monetary Amount Validation', () => {
    it('should validate positive amounts with max 2 decimal places', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000), noNaN: true }),
          (amount) => {
            const rounded = Math.round(amount * 100) / 100;
            expect(validateAmount(rounded)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject negative amounts', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-1000), max: Math.fround(-0.01), noNaN: true }),
          (amount) => {
            expect(validateAmount(amount)).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject zero', () => {
      expect(validateAmount(0)).toBe(false);
    });
  });

  /**
   * Property 30: Payment Reference Format Validation
   * Validates: Requirements 13.6
   */
  describe('Property 30: Payment Reference Format Validation', () => {
    it('should validate alphanumeric references 10-50 chars', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 10, maxLength: 50 }),
          (ref) => {
            expect(validatePaymentReference(ref)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject references shorter than 10 chars', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 9 }),
          (ref) => {
            expect(validatePaymentReference(ref)).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject references with special characters', () => {
      expect(validatePaymentReference('ABC-123-XYZ')).toBe(false);
      expect(validatePaymentReference('ABC@123XYZ')).toBe(false);
      expect(validatePaymentReference('ABC 123 XYZ')).toBe(false);
    });
  });

  /**
   * Email Validation Tests
   */
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
    });
  });

  /**
   * Phone Validation Tests
   */
  describe('Phone Validation', () => {
    it('should validate E.164 format', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('+447911123456')).toBe(true);
      expect(validatePhone('+2348012345678')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(validatePhone('1234567890')).toBe(false);
      expect(validatePhone('+0123456789')).toBe(false);
      expect(validatePhone('+12-345-6789')).toBe(false);
    });
  });

  /**
   * Date Validation Tests
   */
  describe('Date Validation', () => {
    it('should validate ISO 8601 format', () => {
      expect(validateDate('2024-01-15T10:30:00Z')).toBe(true);
      expect(validateDate('2024-01-15T10:30:00.123Z')).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(validateDate('2024-01-15')).toBe(false);
      expect(validateDate('15/01/2024')).toBe(false);
      expect(validateDate('invalid')).toBe(false);
    });
  });
});
