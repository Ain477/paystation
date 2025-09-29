import { PayStationConfig, InitiatePaymentParams, InitiatePaymentResponse, TransactionStatusResponse } from './types/index';
import { ConfigManager } from './config/ConfigManager';
import { HttpClient } from './http/HttpClient';
import { RequestBuilder } from './request/RequestBuilder';
import { ResponseParser } from './response/ResponseParser';
import { PayStationError, ValidationError, AuthenticationError, NetworkError } from './errors/index';

/**
 * PayStation TypeScript SDK
 * 
 * A comprehensive SDK for integrating PayStation's Hosted Checkout API into TypeScript/JavaScript applications.
 * Supports both sandbox and live environments with full type safety and comprehensive error handling.
 * 
 * ## Configuration Options
 * 
 * - **merchantId**: Your unique merchant identifier provided by PayStation
 * - **password**: Your merchant password provided by PayStation  
 * - **environment**: 
 *   - `Environment.SANDBOX` - Uses PayStation's sandbox environment for testing (default)
 *   - `Environment.LIVE` - Uses PayStation's live environment for production
 * 
 * ## Environment Effects
 * 
 * - **Sandbox Environment**: All transactions are test transactions and no real money is processed
 * - **Live Environment**: All transactions are real and will process actual payments
 * - **URL Mapping**: Environment automatically determines the correct PayStation API base URL
 * 
 * ## Features
 * 
 * - **Universal Compatibility**: Works in browser, Node.js, and serverless environments
 * - **Type Safety**: Full TypeScript support with comprehensive type definitions
 * - **Error Handling**: Detailed error types for different failure scenarios
 * - **Validation**: Input validation with descriptive error messages
 * 
 * @example
 * ```typescript
 * import { PayStationSDK, Environment } from 'paystation';
 * 
 * // Initialize SDK for sandbox testing
 * const paystation = new PayStationSDK({
 *   merchantId: 'your-merchant-id',
 *   password: 'your-password',
 *   environment: Environment.SANDBOX
 * });
 * 
 * // Initiate a payment
 * const paymentResponse = await paystation.initiatePayment({
 *   invoiceNumber: 'INV-001',
 *   paymentAmount: 100.50,
 *   customerName: 'John Doe',
 *   customerPhone: '+8801234567890',
 *   customerEmail: 'john@example.com',
 *   callbackUrl: 'https://yoursite.com/callback'
 * });
 * 
 * // Check transaction status
 * const status = await paystation.getTransactionStatus('INV-001');
 * ```
 */
export class PayStationSDK {
  private readonly configManager: ConfigManager;
  private readonly httpClient: HttpClient;
  private readonly requestBuilder: RequestBuilder;
  private readonly responseParser: ResponseParser;

  /**
   * Creates a new PayStation SDK instance
   * 
   * @param config - Configuration object containing merchant credentials and environment
   * @param config.merchantId - Merchant ID provided by PayStation
   * @param config.password - Password provided by PayStation
   * @param config.environment - Environment to use ('sandbox' or 'live')
   * 
   * @throws {ValidationError} When configuration is invalid or missing required fields
   * 
   * @example
   * ```typescript
   * const paystation = new PayStationSDK({
   *   merchantId: 'your-merchant-id',
   *   password: 'your-password',
   *   environment: Environment.SANDBOX
   * });
   * ```
   */
  constructor(config: PayStationConfig) {
    // Initialize configuration manager (validates config)
    this.configManager = new ConfigManager(config);
    
    // Initialize HTTP client
    this.httpClient = new HttpClient();
    
    // Initialize request builder
    this.requestBuilder = new RequestBuilder(this.configManager);
    
    // Initialize response parser
    this.responseParser = new ResponseParser();
  }

  /**
   * Initiates a payment with PayStation's Hosted Checkout
   * 
   * This method creates a payment request and returns a payment URL that customers
   * can be redirected to for completing their payment through PayStation's secure
   * hosted checkout page.
   * 
   * @param params - Payment initiation parameters
   * @param params.invoiceNumber - Unique invoice number for the transaction
   * @param params.paymentAmount - Payment amount (must be greater than 0)
   * @param params.customerName - Customer's full name
   * @param params.customerPhone - Customer's phone number
   * @param params.customerEmail - Customer's email address (must be valid email format)
   * @param params.callbackUrl - URL to redirect after payment completion (must be valid HTTP/HTTPS URL)
   * @param params.currency - Currency code (optional)
   * @param params.payWithCharge - Payment amount including charges (optional)
   * @param params.reference - Reference information (optional)
   * @param params.customerAddress - Customer's address (optional)
   * @param params.checkoutItems - Checkout items description (optional)
   * @param params.optA - Optional parameter A (optional)
   * @param params.optB - Optional parameter B (optional)
   * @param params.optC - Optional parameter C (optional)
   * @param params.emi - EMI option (optional)
   * 
   * @returns Promise resolving to payment initiation response containing payment URL
   * 
   * @throws {ValidationError} When required parameters are missing or invalid
   * @throws {AuthenticationError} When merchant credentials are invalid
   * @throws {NetworkError} When network request fails
   * @throws {PayStationError} When PayStation API returns an error
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await paystation.initiatePayment({
   *     invoiceNumber: 'INV-001',
   *     paymentAmount: 100.50,
   *     customerName: 'John Doe',
   *     customerPhone: '+8801234567890',
   *     customerEmail: 'john@example.com',
   *     callbackUrl: 'https://yoursite.com/callback',
   *     reference: 'Order #12345',
   *     checkoutItems: 'Product A x1, Product B x2'
   *   });
   *   
   *   // Redirect customer to payment URL
   *   window.location.href = response.paymentUrl;
   * } catch (error) {
   *   if (error instanceof ValidationError) {
   *     console.error('Invalid parameters:', error.message);
   *   } else if (error instanceof AuthenticationError) {
   *     console.error('Authentication failed:', error.message);
   *   } else {
   *     console.error('Payment initiation failed:', error.message);
   *   }
   * }
   * ```
   */
  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResponse> {
    try {
      // Build the request
      const request = this.requestBuilder.buildInitiatePaymentRequest(params);
      
      // Make the HTTP request
      const response = await this.httpClient.request(request);
      
      // Handle HTTP errors
      if (response.status >= 400) {
        this.responseParser.parseErrorResponse(response);
      }
      
      // Parse and return the response
      return this.responseParser.parseInitiatePaymentResponse(response);
    } catch (error) {
      // Re-throw known error types
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof NetworkError || 
          error instanceof PayStationError) {
        throw error;
      }
      
      // Wrap unexpected errors
      throw new PayStationError(
        'An unexpected error occurred during payment initiation',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Retrieves transaction status by invoice number
   * 
   * This method checks the current status of a transaction using the invoice number
   * that was provided during payment initiation. It returns detailed information
   * about the transaction including payment status, amount, and payment method used.
   * 
   * @param invoiceNumber - Invoice number to check status for
   * 
   * @returns Promise resolving to transaction status response with transaction details
   * 
   * @throws {ValidationError} When invoice number is invalid or empty
   * @throws {AuthenticationError} When merchant credentials are invalid
   * @throws {NetworkError} When network request fails
   * @throws {PayStationError} When PayStation API returns an error or transaction not found
   * 
   * @example
   * ```typescript
   * try {
   *   const status = await paystation.getTransactionStatus('INV-001');
   *   
   *   if (status.data) {
   *     console.log('Transaction Status:', status.data.transactionStatus);
   *     console.log('Payment Amount:', status.data.paymentAmount);
   *     console.log('Payment Method:', status.data.paymentMethod);
   *     
   *     if (status.data.transactionStatus === 'success') {
   *       console.log('Payment completed successfully!');
   *     } else if (status.data.transactionStatus === 'processing') {
   *       console.log('Payment is still processing...');
   *     } else if (status.data.transactionStatus === 'failed') {
   *       console.log('Payment failed');
   *     }
   *   }
   * } catch (error) {
   *   if (error instanceof PayStationError) {
   *     console.error('Transaction not found or API error:', error.message);
   *   } else {
   *     console.error('Status check failed:', error.message);
   *   }
   * }
   * ```
   */
  async getTransactionStatus(invoiceNumber: string): Promise<TransactionStatusResponse> {
    try {
      // Build the request
      const request = this.requestBuilder.buildTransactionStatusRequest(invoiceNumber);
      
      // Make the HTTP request
      const response = await this.httpClient.request(request);
      
      // Handle HTTP errors
      if (response.status >= 400) {
        this.responseParser.parseErrorResponse(response);
      }
      
      // Parse and return the response
      return this.responseParser.parseTransactionStatusResponse(response);
    } catch (error) {
      // Re-throw known error types
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof NetworkError || 
          error instanceof PayStationError) {
        throw error;
      }
      
      // Wrap unexpected errors
      throw new PayStationError(
        'An unexpected error occurred during transaction status check',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Retrieves transaction status by PayStation transaction ID
   * 
   * This method checks the current status of a transaction using the PayStation
   * transaction ID (trx_id) returned from previous API calls. This uses PayStation's
   * v2 transaction status endpoint and provides detailed transaction information.
   * 
   * @param transactionId - PayStation transaction ID to check status for
   * 
   * @returns Promise resolving to transaction status response with detailed transaction information
   * 
   * @throws {ValidationError} When transaction ID is invalid or empty
   * @throws {AuthenticationError} When merchant credentials are invalid
   * @throws {NetworkError} When network request fails
   * @throws {PayStationError} When PayStation API returns an error or transaction not found
   * 
   * @example
   * ```typescript
   * try {
   *   const status = await paystation.getTransactionStatusById('TXN123456789');
   *   
   *   if (status.data) {
   *     console.log('Transaction Status:', status.data.transactionStatus);
   *     console.log('Transaction Amount:', status.data.transactionAmount);
   *     console.log('Transaction Date:', status.data.transactionDate);
   *     console.log('Request Amount:', status.data.requestAmount);
   *     
   *     if (status.data.transactionStatus === 'success') {
   *       console.log('Payment completed successfully!');
   *       console.log('Transaction ID:', status.data.transactionId);
   *     }
   *   }
   * } catch (error) {
   *   if (error instanceof PayStationError) {
   *     console.error('Transaction not found or API error:', error.message);
   *   } else {
   *     console.error('Status check failed:', error.message);
   *   }
   * }
   * ```
   */
  async getTransactionStatusById(transactionId: string): Promise<TransactionStatusResponse> {
    try {
      // Build the request
      const request = this.requestBuilder.buildTransactionStatusByIdRequest(transactionId);
      
      // Make the HTTP request
      const response = await this.httpClient.request(request);
      
      // Handle HTTP errors
      if (response.status >= 400) {
        this.responseParser.parseErrorResponse(response);
      }
      
      // Parse and return the response
      return this.responseParser.parseTransactionStatusResponse(response);
    } catch (error) {
      // Re-throw known error types
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof NetworkError || 
          error instanceof PayStationError) {
        throw error;
      }
      
      // Wrap unexpected errors
      throw new PayStationError(
        'An unexpected error occurred during transaction status check by ID',
        undefined,
        error as Error
      );
    }
  }
}