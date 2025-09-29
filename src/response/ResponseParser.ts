import { HttpResponse } from '../types/http';
import { InitiatePaymentResponse, TransactionStatusResponse } from '../types/responses';
import { PayStationError, ValidationError, AuthenticationError } from '../errors';

/**
 * Parses and validates API responses from PayStation
 */
export class ResponseParser {
  /**
   * Parses initiate payment response from PayStation API
   * @param response - HTTP response from the API
   * @returns Parsed and typed initiate payment response
   * @throws PayStationError when API returns error status
   * @throws ValidationError when response format is invalid
   */
  parseInitiatePaymentResponse(response: HttpResponse): InitiatePaymentResponse {
    // First validate that we have a valid response structure
    this.validateResponseStructure(response);
    
    const data = response.data as any;
    
    // Validate required fields
    if (!data.statusCode || !data.status || !data.message) {
      throw new ValidationError('Invalid response format: missing required fields (statusCode, status, message)');
    }
    
    // Check if API returned an error status
    if (data.status === 'failed') {
      throw new PayStationError(data.message, data.statusCode);
    }
    
    // Parse successful response
    const parsedResponse: InitiatePaymentResponse = {
      statusCode: String(data.statusCode),
      status: data.status,
      message: String(data.message)
    };
    
    // Add optional fields if present
    if (data.paymentAmount !== undefined) {
      parsedResponse.paymentAmount = String(data.paymentAmount);
    }
    
    if (data.invoiceNumber !== undefined) {
      parsedResponse.invoiceNumber = String(data.invoiceNumber);
    }
    
    if (data.paymentUrl !== undefined) {
      parsedResponse.paymentUrl = String(data.paymentUrl);
    }
    
    return parsedResponse;
  }  
/**
   * Parses transaction status response from PayStation API
   * @param response - HTTP response from the API
   * @returns Parsed and typed transaction status response
   * @throws PayStationError when API returns error status
   * @throws ValidationError when response format is invalid
   */
  parseTransactionStatusResponse(response: HttpResponse): TransactionStatusResponse {
    // First validate that we have a valid response structure
    this.validateResponseStructure(response);
    
    const data = response.data as any;
    
    // Validate required fields
    if (!data.statusCode || !data.status || !data.message) {
      throw new ValidationError('Invalid response format: missing required fields (statusCode, status, message)');
    }
    
    // Check if API returned an error status
    if (data.status === 'failed') {
      throw new PayStationError(data.message, data.statusCode);
    }
    
    // Parse successful response
    const parsedResponse: TransactionStatusResponse = {
      statusCode: String(data.statusCode),
      status: data.status,
      message: String(data.message)
    };
    
    // Parse transaction data if present
    if (data.data) {
      parsedResponse.data = this.parseTransactionData(data.data);
    }
    
    return parsedResponse;
  }

  /**
   * Parses error response and throws appropriate error type
   * @param response - HTTP response containing error
   * @throws AuthenticationError for 401/403 status codes
   * @throws ValidationError for 400 status codes
   * @throws PayStationError for other error responses
   */
  parseErrorResponse(response: HttpResponse): never {
    // Map HTTP status codes to appropriate error types
    if (response.status === 401 || response.status === 403) {
      const message = this.extractErrorMessage(response) || 'Authentication failed';
      throw new AuthenticationError(message, String(response.status));
    }
    
    if (response.status === 400) {
      const message = this.extractErrorMessage(response) || 'Invalid request parameters';
      throw new ValidationError(message);
    }
    
    // For other HTTP errors, throw generic PayStationError
    const message = this.extractErrorMessage(response) || `HTTP ${response.status}: ${response.statusText}`;
    throw new PayStationError(message, String(response.status));
  }  /**
   
* Validates basic response structure
   * @private
   */
  private validateResponseStructure(response: HttpResponse): void {
    if (!response) {
      throw new ValidationError('Response is null or undefined');
    }
    
    if (response.data === null || response.data === undefined) {
      throw new ValidationError('Response data is null or undefined');
    }
    
    if (typeof response.data !== 'object') {
      throw new ValidationError('Response data is not an object');
    }
  }

  /**
   * Parses transaction data from API response
   * @private
   */
  private parseTransactionData(data: any): any {
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Invalid transaction data format');
    }
    
    // Validate required fields for transaction data
    if (!data.invoiceNumber || !data.transactionStatus || !data.transactionId) {
      throw new ValidationError('Invalid transaction data: missing required fields');
    }
    
    const transactionData: any = {
      invoiceNumber: String(data.invoiceNumber),
      transactionStatus: data.transactionStatus,
      transactionId: String(data.transactionId),
      paymentAmount: String(data.paymentAmount || ''),
      orderDateTime: String(data.orderDateTime || '')
    };
    
    // Add optional fields if present
    if (data.payerMobileNumber !== undefined) {
      transactionData.payerMobileNumber = String(data.payerMobileNumber);
    }
    
    if (data.paymentMethod !== undefined) {
      transactionData.paymentMethod = data.paymentMethod;
    }
    
    if (data.reference !== undefined) {
      transactionData.reference = String(data.reference);
    }
    
    if (data.checkoutItems !== undefined) {
      transactionData.checkoutItems = String(data.checkoutItems);
    }
    
    // Handle v2 API fields
    if (data.transactionAmount !== undefined) {
      transactionData.transactionAmount = Number(data.transactionAmount);
    }
    
    if (data.transactionDate !== undefined) {
      transactionData.transactionDate = String(data.transactionDate);
    }
    
    if (data.requestAmount !== undefined) {
      transactionData.requestAmount = String(data.requestAmount);
    }
    
    return transactionData;
  }

  /**
   * Extracts error message from response
   * @private
   */
  private extractErrorMessage(response: HttpResponse): string | null {
    try {
      const data = response.data as any;
      if (data && typeof data === 'object' && data.message) {
        return String(data.message);
      }
      return null;
    } catch {
      return null;
    }
  }
}