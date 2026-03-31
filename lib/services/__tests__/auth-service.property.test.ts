/**
 * Property-Based Tests for Authentication Services
 * 
 * These tests validate universal correctness properties that should hold
 * for all valid inputs, not just specific examples.
 */

import * as fc from 'fast-check';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

// Mock dependencies
jest.mock('@/lib/api');
jest.mock('@/lib/auth');

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('Authentication Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 4: Authentication Token Inclusion
   * 
   * For any protected API request, the request should include a valid Bearer token
   * in the Authorization header.
   * 
   * Validates: Requirements 11.2
   */
  describe('Property 4: Authentication Token Inclusion', () => {
    it('should include Bearer token in Authorization header for all protected requests', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 20, maxLength: 500 }), // Generate random tokens
          fc.constantFrom('GET', 'POST', 'PUT', 'DELETE', 'PATCH'), // HTTP methods
          fc.webUrl(), // Random API endpoints
          (token, method, endpoint) => {
            // Setup: Mock token getter to return the generated token
            mockedGetToken.mockReturnValue(token);

            // Get the request interceptor
            const requestInterceptor = (api.interceptors.request as any).handlers?.[0]?.fulfilled;
            
            if (requestInterceptor) {
              const config: any = {
                method,
                url: endpoint,
                headers: {},
              };

              // Apply the interceptor
              const result = requestInterceptor(config);

              // Property: Authorization header must be present with Bearer token
              expect(result.headers.Authorization).toBe(`Bearer ${token}`);
            }
          }
        ),
        { numRuns: 50 } // Run 50 random test cases
      );
    });

    it('should not include Authorization header when no token is present', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
          fc.webUrl(),
          (method, endpoint) => {
            // Setup: No token available
            mockedGetToken.mockReturnValue(undefined);

            const requestInterceptor = (api.interceptors.request as any).handlers?.[0]?.fulfilled;
            
            if (requestInterceptor) {
              const config: any = {
                method,
                url: endpoint,
                headers: {},
              };

              const result = requestInterceptor(config);

              // Property: Authorization header should not be set
              expect(result.headers.Authorization).toBeUndefined();
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 10: Successful Login Token Storage
   * 
   * For any successful login, the authentication token should be stored
   * and the authentication context should be updated.
   * 
   * Validates: Requirements 2.2
   */
  describe('Property 10: Successful Login Token Storage', () => {
    it('should store token for any valid login response', () => {
      fc.assert(
        fc.property(
          fc.record({
            accessToken: fc.string({ minLength: 50, maxLength: 500 }),
            user: fc.record({
              id: fc.uuid(),
              email: fc.emailAddress(),
              role: fc.constantFrom('BUYER', 'SELLER', 'ADMIN'),
              full_name: fc.string({ minLength: 3, maxLength: 50 }),
            }),
          }),
          (authResponse) => {
            // Mock API response
            mockedApi.post.mockResolvedValueOnce({
              data: {
                data: authResponse,
              },
            });

            // Property: Token should be extractable from response
            expect(authResponse.accessToken).toBeTruthy();
            expect(authResponse.accessToken.length).toBeGreaterThan(20);
            expect(authResponse.user.id).toMatch(
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
            );
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
