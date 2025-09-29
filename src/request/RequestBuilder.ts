import { ConfigManager } from '../config/ConfigManager';
import { InitiatePaymentParams } from '../types/requests';
import { HttpRequest } from '../types/http';
import { ValidationError } from '../errors/ValidationError';

/**
 * Request builder for PayStation API endpoints
 * Handles formatting and validation of API requests
 */
export class RequestBuilder {
  private readonly configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  /**
   * Build request for payment initiation
   * @param params - Payment initiation parameters
   * @returns Formatted HTTP request
   * @throws {ValidationError} When parameters are invalid
   */
  buildInitiatePaymentRequest(params: InitiatePaymentParams): HttpRequest {
    this.validateInitiatePaymentParams(params);

    const baseUrl = this.configManager.getBaseUrl();
    const url = `${baseUrl}/initiate-payment`;

    // Build form data for the request
    const formData = new URLSearchParams();
    formData.append('merchant_id', this.configManager.getMerchantId());
    formData.append('password', this.configManager.getPassword());
    formData.append('invoice_number', params.invoiceNumber);
    formData.append('payment_amount', params.paymentAmount.toString());
    formData.append('customer_name', params.customerName);
    formData.append('customer_phone', params.customerPhone);
    formData.append('customer_email', params.customerEmail);
    formData.append('callback_url', params.callbackUrl);

    // Add optional parameters if provided
    if (params.currency) {
      formData.append('currency', params.currency);
    }
    if (params.payWithCharge !== undefined) {
      formData.append('pay_with_charge', params.payWithCharge.toString());
    }
    if (params.reference) {
      formData.append('reference', params.reference);
    }
    if (params.customerAddress) {
      formData.append('customer_address', params.customerAddress);
    }
    if (params.checkoutItems) {
      formData.append('checkout_items', params.checkoutItems);
    }
    if (params.optA) {
      formData.append('opt_a', params.optA);
    }
    if (params.optB) {
      formData.append('opt_b', params.optB);
    }
    if (params.optC) {
      formData.append('opt_c', params.optC);
    }
    if (params.emi !== undefined) {
      formData.append('emi', params.emi.toString());
    }

    return {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData
    };
  }

  /**
   * Build request for transaction status check by invoice number
   * @param invoiceNumber - Invoice number to check
   * @returns Formatted HTTP request
   * @throws {ValidationError} When invoice number is invalid
   */
  buildTransactionStatusRequest(invoiceNumber: string): HttpRequest {
    this.validateInvoiceNumber(invoiceNumber);

    const baseUrl = this.configManager.getBaseUrl();
    const url = `${baseUrl}/transaction-status`;

    const formData = new URLSearchParams();
    formData.append('merchant_id', this.configManager.getMerchantId());
    formData.append('password', this.configManager.getPassword());
    formData.append('invoice_number', invoiceNumber);

    return {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData
    };
  }

  /**
   * Build request for transaction status check by transaction ID
   * @param transactionId - Transaction ID to check
   * @returns Formatted HTTP request
   * @throws {ValidationError} When transaction ID is invalid
   */
  buildTransactionStatusByIdRequest(transactionId: string): HttpRequest {
    this.validateTransactionId(transactionId);

    const baseUrl = this.configManager.getBaseUrl();
    const url = `${baseUrl}/v2/transaction-status`;

    const formData = new URLSearchParams();
    formData.append('merchant_id', this.configManager.getMerchantId());
    formData.append('password', this.configManager.getPassword());
    formData.append('trx_id', transactionId);

    return {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData
    };
  }

  /**
   * Validate payment initiation parameters
   * @param params - Parameters to validate
   * @throws {ValidationError} When parameters are invalid
   */
  private validateInitiatePaymentParams(params: InitiatePaymentParams): void {
    if (!params) {
      throw new ValidationError('Payment parameters are required');
    }

    // Validate required string fields
    this.validateRequiredString(params.invoiceNumber, 'invoiceNumber');
    this.validateRequiredString(params.customerName, 'customerName');
    this.validateRequiredString(params.customerPhone, 'customerPhone');
    this.validateRequiredString(params.customerEmail, 'customerEmail');
    this.validateRequiredString(params.callbackUrl, 'callbackUrl');

    // Validate payment amount
    if (typeof params.paymentAmount !== 'number') {
      throw new ValidationError('paymentAmount must be a number');
    }
    if (params.paymentAmount <= 0) {
      throw new ValidationError('paymentAmount must be greater than 0');
    }

    // Validate optional numeric fields
    if (params.payWithCharge !== undefined) {
      if (typeof params.payWithCharge !== 'number') {
        throw new ValidationError('payWithCharge must be a number');
      }
      if (params.payWithCharge < 0) {
        throw new ValidationError('payWithCharge cannot be negative');
      }
    }

    if (params.emi !== undefined) {
      if (typeof params.emi !== 'number') {
        throw new ValidationError('emi must be a number');
      }
      if (params.emi < 0) {
        throw new ValidationError('emi cannot be negative');
      }
    }

    // Validate email format
    if (!this.isValidEmail(params.customerEmail)) {
      throw new ValidationError('customerEmail must be a valid email address');
    }

    // Validate URL format
    if (!this.isValidUrl(params.callbackUrl)) {
      throw new ValidationError('callbackUrl must be a valid URL');
    }
  }

  /**
   * Validate invoice number
   * @param invoiceNumber - Invoice number to validate
   * @throws {ValidationError} When invoice number is invalid
   */
  private validateInvoiceNumber(invoiceNumber: string): void {
    this.validateRequiredString(invoiceNumber, 'invoiceNumber');
  }

  /**
   * Validate transaction ID
   * @param transactionId - Transaction ID to validate
   * @throws {ValidationError} When transaction ID is invalid
   */
  private validateTransactionId(transactionId: string): void {
    this.validateRequiredString(transactionId, 'transactionId');
  }

  /**
   * Validate required string field
   * @param value - Value to validate
   * @param fieldName - Name of the field for error messages
   * @throws {ValidationError} When field is invalid
   */
  private validateRequiredString(value: string, fieldName: string): void {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} is required and must be a string`);
    }
    if (value.trim().length === 0) {
      throw new ValidationError(`${fieldName} cannot be empty or whitespace only`);
    }
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format (only HTTP/HTTPS allowed for callbacks)
   * @param url - URL to validate
   * @returns True if URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }
}