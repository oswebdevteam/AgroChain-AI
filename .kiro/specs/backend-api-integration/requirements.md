# Requirements Document: Backend API Integration for AgroChain AI Frontend

## Introduction

This document specifies the functional and non-functional requirements for integrating the Next.js frontend with the AgroChain AI Backend API. The backend provides a complete agricultural trading platform with payment processing (Interswitch), escrow management, blockchain verification, AI-powered financial identity scoring, and analytics capabilities.

The primary driver for this integration is a critical missing feature: the payment callback route that handles Interswitch payment redirects. Without this route, the payment flow is broken—payments are initiated but cannot be verified or completed. This requirements document addresses this critical gap while establishing comprehensive requirements for all backend API integrations.

## Glossary

- **Frontend**: The Next.js application that provides the user interface for AgroChain AI
- **Backend**: The AgroChain AI Backend API that provides business logic and data persistence
- **Interswitch**: Third-party payment gateway used for processing payments in Nigeria
- **Payment_Reference**: Unique identifier for a payment transaction, provided by Interswitch
- **Escrow**: Financial arrangement where payment is held until delivery is confirmed
- **Blockchain**: Base blockchain network used for immutable transaction records
- **Financial_Identity**: AI-computed credit score and risk assessment for users
- **Order**: A produce trading transaction between buyer and seller
- **API_Service_Layer**: Centralized module containing all backend API integration functions
- **Auth_Token**: JWT bearer token used for authenticating API requests
- **Payment_Callback**: Route that handles redirects from Interswitch after payment attempt
- **Verification_Endpoint**: Backend API endpoint that confirms payment status with Interswitch
- **Transaction_Reference**: Unique identifier for tracking payment transactions (synonym: Payment_Reference)

## Requirements

### Requirement 1: Payment Callback Route

**User Story:** As a buyer, I want the system to automatically verify my payment after I complete it on Interswitch, so that my order is updated and I can proceed with the transaction.

#### Acceptance Criteria

1. WHEN Interswitch redirects to the callback URL with a payment reference THEN THE Frontend SHALL extract the reference parameter from the URL query string
2. WHEN the callback route loads THEN THE Frontend SHALL display a loading state with message "Verifying payment..."
3. WHEN a valid payment reference is extracted THEN THE Frontend SHALL call the Backend verification endpoint with the reference
4. WHEN the Backend returns SUCCESS status THEN THE Frontend SHALL display a success message and redirect to the order details page
5. WHEN the Backend returns FAILED status THEN THE Frontend SHALL display an error message with the failure reason and provide a retry option
6. WHEN the Backend returns PENDING status THEN THE Frontend SHALL display a "Payment is being processed" message
7. IF the payment reference parameter is missing THEN THE Frontend SHALL display an error message and redirect to the orders page
8. WHEN network errors occur during verification THEN THE Frontend SHALL retry up to 3 times with exponential backoff
9. WHEN verification takes longer than 30 seconds THEN THE Frontend SHALL display "This is taking longer than usual" message with a manual retry button

### Requirement 2: Authentication Services

**User Story:** As a user, I want to securely log in and register for the platform, so that I can access my account and perform transactions.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials THEN THE Frontend SHALL call the Backend auth endpoint and receive an access token
2. WHEN login is successful THEN THE Frontend SHALL store the access token securely and update the authentication context
3. WHEN a user submits registration data THEN THE Frontend SHALL validate the data and call the Backend registration endpoint
4. WHEN registration is successful THEN THE Frontend SHALL automatically log the user in with the returned token
5. WHEN a user logs out THEN THE Frontend SHALL clear all authentication tokens and redirect to the login page
6. WHEN an API request receives a 401 Unauthorized response THEN THE Frontend SHALL attempt to refresh the token once
7. IF token refresh fails THEN THE Frontend SHALL clear authentication state and redirect to login with the return URL preserved
8. WHEN the user profile is requested THEN THE Frontend SHALL fetch current user data from the Backend and update the context

### Requirement 3: Order Management Services

**User Story:** As a buyer, I want to create and manage produce orders, so that I can purchase agricultural products from sellers.

#### Acceptance Criteria

1. WHEN a buyer submits a new order with valid data THEN THE Frontend SHALL calculate the total amount as quantity multiplied by unit price
2. WHEN the total amount is calculated THEN THE Frontend SHALL call the Backend order creation endpoint with all order details
3. WHEN an order is created successfully THEN THE Backend SHALL return an order with PENDING status and a unique order ID
4. WHEN a user requests their orders list THEN THE Frontend SHALL call the Backend with pagination parameters
5. WHEN orders are retrieved THEN THE Frontend SHALL display them with pagination metadata
6. WHERE a user filters orders by status THEN THE Frontend SHALL include the status filter in the API request
7. WHEN a user views a specific order THEN THE Frontend SHALL fetch the order details by ID from the Backend
8. WHEN a buyer confirms delivery THEN THE Frontend SHALL call the Backend confirmation endpoint and update the order status to COMPLETED

### Requirement 4: Payment Initiation Services

**User Story:** As a buyer, I want to initiate payment for my orders, so that I can complete my purchase securely through Interswitch.

#### Acceptance Criteria

1. WHEN a buyer initiates payment for an order THEN THE Frontend SHALL call the Backend payment initiation endpoint with order ID, amount, and currency
2. WHEN payment initiation is successful THEN THE Backend SHALL return a redirect URL and transaction reference
3. WHEN the redirect URL is received THEN THE Frontend SHALL store the order ID in session storage and redirect the user to the Interswitch payment page
4. IF payment initiation fails after order creation THEN THE Frontend SHALL display an error message and redirect to the order details page for retry
5. WHEN a user attempts to pay for an already-paid order THEN THE Backend SHALL return an error and THE Frontend SHALL display "This order has already been paid"
6. WHEN payment amount does not match order total THEN THE Backend SHALL reject the request and THE Frontend SHALL display an amount mismatch error

### Requirement 5: Payment Verification Services

**User Story:** As a system, I want to verify payment status with Interswitch, so that I can confirm successful transactions and update order status accordingly.

#### Acceptance Criteria

1. WHEN the Frontend calls the verification endpoint with a payment reference THEN THE Backend SHALL query Interswitch for the transaction status
2. WHEN Interswitch confirms payment success THEN THE Backend SHALL update the transaction status to COMPLETED and create an escrow record
3. WHEN Interswitch reports payment failure THEN THE Backend SHALL update the transaction status to FAILED and return the failure reason
4. WHEN the payment is still processing THEN THE Backend SHALL return PENDING status
5. IF the payment reference is not found THEN THE Backend SHALL return a 404 error and THE Frontend SHALL display "Payment not found"
6. WHEN verification is successful THEN THE Backend SHALL record a blockchain event with the transaction details
7. FOR ALL payment verifications THEN THE Frontend SHALL receive a response containing status, order ID, transaction reference, amount, and message

### Requirement 6: Escrow Management Services

**User Story:** As a platform administrator, I want to manage escrow accounts, so that I can ensure secure fund transfers between buyers and sellers.

#### Acceptance Criteria

1. WHEN a payment is verified as successful THEN THE Backend SHALL automatically create an escrow record with HELD status
2. WHEN an escrow is created THEN THE escrow amount SHALL equal the order total amount
3. WHEN a user requests escrow details for an order THEN THE Frontend SHALL call the Backend escrow endpoint with the order ID
4. WHEN an administrator releases an escrow THEN THE Frontend SHALL display a confirmation dialog before calling the Backend release endpoint
5. WHEN escrow release is confirmed THEN THE Backend SHALL update the escrow status to RELEASED and initiate fund transfer to the seller
6. IF an escrow is already released THEN THE Backend SHALL reject release attempts with error "Escrow already processed"
7. WHEN escrow is released THEN THE Backend SHALL record a blockchain event and return the transaction hash
8. WHILE an order is not in DELIVERED or COMPLETED status THEN THE Backend SHALL prevent escrow release

### Requirement 7: Blockchain Verification Services

**User Story:** As a user, I want to view blockchain proof of my transactions, so that I can verify the immutability and authenticity of transaction records.

#### Acceptance Criteria

1. WHEN a user requests blockchain proof for an order THEN THE Frontend SHALL call the Backend blockchain endpoint with the order ID
2. WHEN blockchain proof exists THEN THE Backend SHALL return all blockchain events associated with the order
3. WHEN displaying blockchain proof THEN THE Frontend SHALL show transaction hashes, event types, timestamps, and blockchain explorer links
4. WHEN a payment is completed THEN THE Backend SHALL record a blockchain event within 60 seconds
5. WHEN an escrow is released THEN THE Backend SHALL record a blockchain event within 60 seconds

### Requirement 8: Financial Identity Services

**User Story:** As a user, I want to view my financial identity score, so that I can understand my creditworthiness and financing eligibility on the platform.

#### Acceptance Criteria

1. WHEN a user requests their financial identity THEN THE Frontend SHALL call the Backend financial identity endpoint with the user ID
2. WHEN financial identity is retrieved THEN THE Backend SHALL return an AI-computed credit readiness score between 0 and 100
3. WHEN displaying financial identity THEN THE Frontend SHALL show credit score, risk indicators, transaction history summary, and financing eligibility
4. WHEN a user has insufficient transaction history THEN THE Backend SHALL return eligibility status NEEDS_MORE_DATA
5. IF a user attempts to view another user's financial identity THEN THE Backend SHALL return 403 Forbidden unless the requester is an admin
6. WHEN financial identity is requested THEN THE Backend SHALL not mutate any user data (read-only operation)

### Requirement 9: Analytics Services

**User Story:** As a user, I want to view analytics about trade corridors and exchange rates, so that I can make informed trading decisions.

#### Acceptance Criteria

1. WHEN a user requests trade corridor analytics THEN THE Frontend SHALL call the Backend analytics endpoint with optional date range and produce type filters
2. WHEN trade corridor data is retrieved THEN THE Backend SHALL return aggregated statistics about trading patterns between regions
3. WHEN a user requests foreign exchange rates THEN THE Frontend SHALL call the Backend FX endpoint with source currency, target currency, and amount
4. WHEN FX rates are retrieved THEN THE Backend SHALL return the current exchange rate, converted amount, and timestamp
5. WHERE date range filters are provided THEN THE Backend SHALL return analytics data only for the specified period
6. WHERE produce type filter is provided THEN THE Backend SHALL return analytics data only for the specified produce type

### Requirement 10: Error Handling and User Experience

**User Story:** As a user, I want clear error messages and recovery options when things go wrong, so that I can understand issues and take corrective action.

#### Acceptance Criteria

1. WHEN any API request fails with a network error THEN THE Frontend SHALL display a toast notification with message "Network error. Please check your connection."
2. WHEN a 401 Unauthorized error occurs THEN THE Frontend SHALL attempt token refresh once before redirecting to login
3. WHEN a 403 Forbidden error occurs THEN THE Frontend SHALL display "You don't have permission to perform this action"
4. WHEN a 404 Not Found error occurs THEN THE Frontend SHALL display a specific error message like "Order not found" or "Payment not found"
5. WHEN a 500 Server Error occurs THEN THE Frontend SHALL display "Something went wrong. Please try again." with a retry button
6. WHEN an API request is in progress THEN THE Frontend SHALL display a loading indicator
7. WHEN form validation fails THEN THE Frontend SHALL display field-specific error messages
8. WHEN an error occurs THEN THE Frontend SHALL log error details to the monitoring system with an error ID for support reference

### Requirement 11: Security and Authentication

**User Story:** As a system administrator, I want secure API communication and proper authentication, so that user data and transactions are protected.

#### Acceptance Criteria

1. THE Frontend SHALL store authentication tokens in httpOnly cookies with SameSite attribute set to 'strict'
2. THE Frontend SHALL include the Bearer token in the Authorization header for all protected API requests
3. THE Frontend SHALL validate all user inputs on the client side before sending to the Backend
4. THE Frontend SHALL sanitize user inputs to prevent XSS attacks
5. THE Frontend SHALL never log authentication tokens or passwords
6. THE Frontend SHALL use HTTPS for all API communications
7. THE Frontend SHALL validate that API responses match expected TypeScript schemas
8. THE Frontend SHALL mask sensitive data in the UI such as partial payment references
9. WHEN handling payment data THEN THE Frontend SHALL never store payment card details locally
10. WHEN logging payment attempts THEN THE Frontend SHALL log all attempts for audit purposes without exposing sensitive data

### Requirement 12: Performance and Caching

**User Story:** As a user, I want fast page loads and responsive interactions, so that I can efficiently complete my tasks on the platform.

#### Acceptance Criteria

1. THE Frontend SHALL cache user profile data for 5 minutes to reduce API calls
2. THE Frontend SHALL cache financial identity data for 10 minutes
3. THE Frontend SHALL cache analytics data for 1 hour
4. WHEN a user performs an action THEN THE Frontend SHALL update the UI optimistically and rollback on API failure
5. WHEN displaying paginated lists THEN THE Frontend SHALL use a default page size of 20 items
6. WHEN a user scrolls near the end of a list THEN THE Frontend SHALL prefetch the next page
7. WHEN a user types in a search field THEN THE Frontend SHALL debounce the input by 300ms before making API calls
8. WHEN a user changes filters THEN THE Frontend SHALL debounce the changes by 500ms before making API calls

### Requirement 13: Data Validation and Type Safety

**User Story:** As a developer, I want strong type safety and validation, so that I can prevent runtime errors and ensure data integrity.

#### Acceptance Criteria

1. THE Frontend SHALL validate that all UUIDs match the format: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
2. THE Frontend SHALL validate that all monetary amounts are positive numbers with maximum 2 decimal places
3. THE Frontend SHALL validate that all dates are in ISO 8601 format
4. THE Frontend SHALL validate that email addresses match RFC 5322 format
5. WHERE phone numbers are provided THEN THE Frontend SHALL validate they match E.164 format
6. THE Frontend SHALL validate that payment references are alphanumeric strings between 10 and 50 characters
7. THE Frontend SHALL use TypeScript interfaces to enforce type safety for all API requests and responses
8. WHEN API responses are received THEN THE Frontend SHALL validate the response structure matches expected types

### Requirement 14: Order Status Transitions

**User Story:** As a system, I want to enforce valid order status transitions, so that orders follow the correct workflow and maintain data integrity.

#### Acceptance Criteria

1. WHEN an order is created THEN THE Backend SHALL set the initial status to PENDING
2. WHEN payment is verified THEN THE Backend SHALL transition order status from PENDING to PAID
3. WHEN a seller confirms shipment THEN THE Backend SHALL transition order status from PAID to SHIPPED
4. WHEN delivery is confirmed THEN THE Backend SHALL transition order status from SHIPPED to DELIVERED
5. WHEN a buyer confirms receipt THEN THE Backend SHALL transition order status from DELIVERED to COMPLETED
6. IF an invalid status transition is attempted THEN THE Backend SHALL reject the request with error "Invalid status transition"
7. THE Frontend SHALL only display action buttons that correspond to valid status transitions for the current order state

### Requirement 15: API Response Consistency

**User Story:** As a developer, I want consistent API response formats, so that I can handle responses uniformly across the application.

#### Acceptance Criteria

1. WHEN an API request succeeds THEN THE Backend SHALL return a response with success: true and a data field containing the result
2. WHEN an API request fails THEN THE Backend SHALL return a response with success: false and a message field containing the error description
3. WHERE validation errors occur THEN THE Backend SHALL include an errors field with field-specific error messages
4. WHEN paginated data is returned THEN THE Backend SHALL include pagination metadata with page, limit, total, and totalPages fields
5. THE Frontend SHALL handle both success and error response formats consistently across all API service functions

