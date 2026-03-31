# Implementation Plan: Backend API Integration

## Overview

This implementation plan addresses the critical missing payment callback route and establishes comprehensive backend API integration for the AgroChain AI platform. The payment flow is currently broken—payments are initiated but cannot be verified. This plan prioritizes fixing the payment callback route while building out the complete API service layer with proper error handling, loading states, and user feedback.

## Tasks

- [x] 1. Create payment callback route (CRITICAL - HIGHEST PRIORITY)
  - [x] 1.1 Create payment callback page component
    - Create `app/payment/callback/page.tsx` with async searchParams handling
    - Extract and validate `ref` parameter from URL query string
    - Implement loading state with "Verifying payment..." message
    - Handle missing ref parameter with error message and redirect to orders
    - _Requirements: 1.1, 1.2, 1.7_
  
  - [x] 1.2 Implement payment verification API call
    - Create `verifyPayment()` function in API service layer
    - Call `GET /api/v1/payments/verify/{ref}` endpoint
    - Implement retry logic with exponential backoff (max 3 attempts)
    - Handle network errors with retry mechanism
    - _Requirements: 1.3, 1.8, 5.1_
  
  - [x] 1.3 Handle verification response states
    - Display success message and order details link for SUCCESS status
    - Display failure message with reason and retry button for FAILED status
    - Display "Payment is being processed" message for PENDING status
    - Auto-redirect to order details page after 3 seconds on success
    - _Requirements: 1.4, 1.5, 1.6_
  
  - [x] 1.4 Add timeout handling for slow verification
    - Display "This is taking longer than usual" message after 30 seconds
    - Provide manual "Check Status" retry button
    - Store ref in localStorage for later retry
    - _Requirements: 1.9_
  
  - [x] 1.5 Write unit tests for payment callback route
    - Test loading state rendering
    - Test success state with redirect
    - Test failure state with error message
    - Test missing ref parameter handling
    - Test retry logic on network failure
    - _Requirements: 1.1-1.9_

- [x] 2. Checkpoint - Verify payment callback works end-to-end
  - Ensure payment callback route is accessible
  - Test with mock payment reference
  - Verify error handling for edge cases
  - Ask the user if questions arise

- [x] 3. Create core API service layer structure
  - [x] 3.1 Create API service types and interfaces
    - Create `lib/types/api-types.ts` with all API request/response interfaces
    - Define `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>` types
    - Define payment, order, escrow, blockchain, identity, analytics interfaces
    - Add validation helper types for UUIDs, amounts, dates
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 15.1, 15.2_
  
  - [x] 3.2 Create centralized API service module
    - Create `lib/services/api-service.ts` as main service module
    - Import axios instance from `lib/api.ts`
    - Set up service function structure with consistent error handling
    - Add JSDoc comments for all service functions
    - _Requirements: 10.1-10.8_
  
  - [x] 3.3 Enhance axios interceptors for better error handling
    - Update response interceptor in `lib/api.ts` to handle 403, 404, 500 errors
    - Add request retry logic for network failures
    - Add error logging with unique error IDs
    - Implement token refresh logic for 401 errors
    - _Requirements: 2.6, 2.7, 10.2, 10.3, 10.4, 10.5, 10.8_

- [x] 4. Implement authentication services
  - [x] 4.1 Create auth service functions
    - Implement `login(credentials)` function calling `POST /api/v1/auth/login`
    - Implement `register(data)` function calling `POST /api/v1/auth/register`
    - Implement `logout()` function to clear tokens and redirect
    - Implement `getProfile()` function calling `GET /api/v1/auth/profile`
    - _Requirements: 2.1, 2.3, 2.5, 2.8_
  
  - [x] 4.2 Update AuthContext to use new auth services
    - Replace direct axios calls with auth service functions
    - Add token refresh logic on 401 errors
    - Preserve return URL on session expiry
    - Update context state management for login/logout
    - _Requirements: 2.2, 2.4, 2.6, 2.7_
  
  - [x] 4.3 Write property test for authentication token inclusion
    - **Property 4: Authentication Token Inclusion**
    - **Validates: Requirements 11.2**
    - Test that all protected API requests include Bearer token in Authorization header
  
  - [x] 4.4 Write property test for logout cleanup
    - **Property 11: Logout Cleanup**
    - **Validates: Requirements 2.5**
    - Test that logout clears all tokens and redirects to login

- [x] 5. Implement order management services
  - [x] 5.1 Create order service functions
    - Implement `createOrder(data)` function calling `POST /api/v1/orders`
    - Implement `getOrders(params)` function calling `GET /api/v1/orders` with pagination
    - Implement `getOrderById(id)` function calling `GET /api/v1/orders/{id}`
    - Implement `confirmDelivery(orderId)` function calling `POST /api/v1/orders/{id}/confirm-delivery`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8_
  
  - [x] 5.2 Add order filtering and pagination support
    - Add status filter parameter to `getOrders()` function
    - Implement pagination with default page size of 20
    - Return pagination metadata with responses
    - _Requirements: 3.6, 12.5, 15.4_
  
  - [x] 5.3 Write property test for order total calculation
    - **Property 2: Order Total Calculation**
    - **Validates: Requirements 3.1**
    - Test that total_amount equals quantity multiplied by unit_price
  
  - [x] 5.4 Write unit tests for order services
    - Test order creation with valid data
    - Test order list retrieval with pagination
    - Test order filtering by status
    - Test delivery confirmation flow

- [x] 6. Implement payment services
  - [x] 6.1 Create payment service functions
    - Implement `initiatePayment(data)` function calling `POST /api/v1/payments/initiate`
    - Implement `verifyPayment(ref)` function calling `GET /api/v1/payments/verify/{ref}` (if not already created in task 1.2)
    - Add payment reference validation helper
    - Store order ID in sessionStorage before redirect
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.7, 13.6_
  
  - [x] 6.2 Add payment error handling
    - Handle "Order already paid" error with appropriate message
    - Handle amount mismatch errors
    - Handle payment initiation failures with retry option
    - Handle payment not found (404) errors
    - _Requirements: 4.4, 4.5, 4.6, 5.5_
  
  - [x] 6.3 Write property test for payment verification idempotency
    - **Property 1: Payment Verification Idempotency**
    - **Validates: Requirements 5.1, 5.7**
    - Test that calling verification multiple times returns same result
  
  - [x] 6.4 Write property test for payment reference uniqueness
    - **Property 6: Payment Reference Uniqueness**
    - **Validates: Requirements 5.7**
    - Test that different payment references map to different transactions

- [x] 7. Checkpoint - Verify core payment and order flows work
  - Test order creation flow
  - Test payment initiation flow
  - Test payment verification flow
  - Ensure all tests pass, ask the user if questions arise

- [x] 8. Implement escrow management services
  - [x] 8.1 Create escrow service functions
    - Implement `getEscrowByOrderId(orderId)` function calling `GET /api/v1/escrow/{orderId}`
    - Implement `releaseEscrow(orderId, adminId, notes)` function calling `POST /api/v1/escrow/{orderId}/release`
    - Add confirmation dialog before escrow release
    - Display blockchain transaction hash after release
    - _Requirements: 6.3, 6.4, 6.5, 6.7_
  
  - [x] 8.2 Add escrow validation and error handling
    - Validate escrow status is HELD before release
    - Validate order status is DELIVERED or COMPLETED
    - Handle "Escrow already processed" error
    - Handle unauthorized access errors
    - _Requirements: 6.6, 6.8_
  
  - [x] 8.3 Write property test for escrow amount consistency
    - **Property 5: Escrow Amount Consistency**
    - **Validates: Requirements 6.2**
    - Test that escrow amount equals order total amount
  
  - [x] 8.4 Write property test for escrow release precondition
    - **Property 14: Escrow Release Precondition**
    - **Validates: Requirements 6.8**
    - Test that escrow can only be released when status is HELD and order is DELIVERED/COMPLETED

- [x] 9. Implement blockchain verification services
  - [x] 9.1 Create blockchain service functions
    - Implement `getBlockchainProof(orderId)` function calling `GET /api/v1/blockchain/proof/{orderId}`
    - Format blockchain events for display with transaction hashes
    - Add blockchain explorer links for transaction hashes
    - Display event types, timestamps, and block numbers
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 9.2 Write property test for blockchain event recording
    - **Property 15: Blockchain Event Recording**
    - **Validates: Requirements 5.6, 6.7, 7.4, 7.5**
    - Test that blockchain events are recorded within 60 seconds of payment/escrow actions

- [x] 10. Implement financial identity services
  - [x] 10.1 Create financial identity service functions
    - Implement `getFinancialIdentity(userId)` function calling `GET /api/v1/financial-identity/{userId}`
    - Display credit readiness score, risk indicators, and transaction history
    - Show financing eligibility status
    - Handle insufficient data scenario (NEEDS_MORE_DATA)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 10.2 Add financial identity access control
    - Validate user can only view their own financial identity
    - Allow admin users to view any user's financial identity
    - Handle 403 Forbidden errors for unauthorized access
    - _Requirements: 8.5_
  
  - [x] 10.3 Write property test for credit score range
    - **Property 16: Credit Score Range**
    - **Validates: Requirements 8.2**
    - Test that credit readiness score is between 0 and 100 inclusive

- [x] 11. Implement analytics services
  - [x] 11.1 Create analytics service functions
    - Implement `getTradeCorridors(params)` function calling `GET /api/v1/analytics/trade-corridors`
    - Implement `getFxRate(params)` function calling `GET /api/v1/analytics/fx-rate`
    - Add date range and produce type filters
    - Format analytics data for display
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [x] 11.2 Write unit tests for analytics services
    - Test trade corridor retrieval with filters
    - Test FX rate calculation
    - Test date range filtering
    - Test produce type filtering

- [x] 12. Implement comprehensive error handling and UX improvements
  - [x] 12.1 Add toast notifications for all error scenarios
    - Network errors: "Network error. Please check your connection."
    - 401 errors: Trigger token refresh, then redirect to login if fails
    - 403 errors: "You don't have permission to perform this action"
    - 404 errors: Specific messages like "Order not found" or "Payment not found"
    - 500 errors: "Something went wrong. Please try again." with retry button
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 12.2 Add loading states for all async operations
    - Display loading indicators during API requests
    - Show skeleton loaders for data fetching
    - Disable buttons during submission
    - _Requirements: 10.6_
  
  - [x] 12.3 Add form validation with field-specific errors
    - Validate all inputs before API calls
    - Display field-specific error messages
    - Sanitize inputs to prevent XSS
    - _Requirements: 10.7, 11.3, 11.4_
  
  - [x] 12.4 Write property tests for error handling
    - **Property 24: Network Error Toast Notification**
    - **Validates: Requirements 10.1**
    - Test that network errors display toast notification
    - **Property 23: Loading Indicator Display**
    - **Validates: Requirements 10.6**
    - Test that loading indicators appear during API requests

- [x] 13. Implement data validation and type safety
  - [x] 13.1 Create validation helper functions
    - Create UUID validation function matching format: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
    - Create amount validation function (positive, max 2 decimals)
    - Create date validation function (ISO 8601 format)
    - Create email validation function (RFC 5322 format)
    - Create phone validation function (E.164 format)
    - Create payment reference validation function (alphanumeric, 10-50 chars)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 13.2 Add runtime type validation for API responses
    - Validate API response structure matches expected TypeScript types
    - Add response schema validation
    - Handle malformed responses gracefully
    - _Requirements: 11.7, 13.8_
  
  - [x] 13.3 Write property tests for validation functions
    - **Property 28: UUID Format Validation**
    - **Validates: Requirements 13.1**
    - **Property 29: Monetary Amount Validation**
    - **Validates: Requirements 13.2**
    - **Property 30: Payment Reference Format Validation**
    - **Validates: Requirements 13.6**

- [x] 14. Implement security enhancements
  - [x] 14.1 Enhance token management security
    - Verify tokens stored in httpOnly cookies with SameSite='strict'
    - Implement token refresh before expiry
    - Clear tokens on logout
    - Validate token on protected routes
    - _Requirements: 11.1, 11.2_
  
  - [x] 14.2 Add security logging and monitoring
    - Never log tokens or passwords
    - Mask sensitive data in UI (partial payment references)
    - Log all payment attempts for audit
    - Add error logging with unique IDs
    - _Requirements: 11.5, 11.8, 11.10_
  
  - [x] 14.3 Ensure HTTPS for all API calls
    - Validate all API URLs use HTTPS protocol
    - Add warning if non-HTTPS detected
    - _Requirements: 11.6_
  
  - [x] 14.4 Write property tests for security requirements
    - **Property 20: HTTPS Protocol Usage**
    - **Validates: Requirements 11.6**
    - **Property 21: Sensitive Data Never Logged**
    - **Validates: Requirements 11.5**

- [x] 15. Implement performance optimizations
  - [x] 15.1 Add caching for API responses
    - Cache user profile for 5 minutes
    - Cache financial identity for 10 minutes
    - Cache analytics data for 1 hour
    - Use React state or consider adding @tanstack/react-query
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [x] 15.2 Implement optimistic UI updates
    - Update UI immediately for user actions
    - Rollback on API failure
    - Show background sync indicators
    - _Requirements: 12.4_
  
  - [x] 15.3 Add pagination and prefetching
    - Implement pagination with default page size 20
    - Prefetch next page on scroll
    - Add infinite scroll for mobile
    - _Requirements: 12.5, 12.6_
  
  - [x] 15.4 Add input debouncing
    - Debounce search inputs by 300ms
    - Debounce filter changes by 500ms
    - Throttle analytics tracking by 1000ms
    - _Requirements: 12.7, 12.8_
  
  - [x] 15.5 Write property tests for performance features
    - **Property 26: Cache Duration Consistency**
    - **Validates: Requirements 12.1, 12.2, 12.3**
    - **Property 27: Debounce Timing Consistency**
    - **Validates: Requirements 12.7, 12.8**
    - **Property 25: Optimistic UI Updates**
    - **Validates: Requirements 12.4**

- [x] 16. Implement order status transition validation
  - [x] 16.1 Add status transition validation
    - Validate status transitions follow state machine: PENDING → PAID → SHIPPED → DELIVERED → COMPLETED
    - Prevent invalid status transitions
    - Display only valid action buttons for current order state
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_
  
  - [x] 16.2 Write property test for status transition validity
    - **Property 3: Status Transition Validity**
    - **Validates: Requirements 14.2, 14.3, 14.4, 14.5, 14.6**

- [x] 17. Ensure API response consistency
  - [x] 17.1 Standardize API response handling
    - Handle success responses with success: true and data field
    - Handle error responses with success: false and message field
    - Include validation errors in errors field
    - Include pagination metadata for paginated responses
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 17.2 Write property test for API response structure
    - **Property 17: API Response Structure Consistency**
    - **Validates: Requirements 15.1, 15.2**
    - **Property 18: Pagination Metadata Completeness**
    - **Validates: Requirements 15.4**

- [x] 18. Final checkpoint - Comprehensive testing and validation
  - Run all unit tests and ensure they pass
  - Test complete user flows end-to-end
  - Verify error handling for all edge cases
  - Verify security measures are in place
  - Verify performance optimizations work
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at critical milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The payment callback route (Task 1) is the highest priority as it fixes a critical broken flow
- All implementation uses TypeScript with Next.js App Router conventions
- API service layer provides centralized, consistent interface to backend
- Error handling and user feedback are prioritized throughout
