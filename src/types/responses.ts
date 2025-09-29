/**
 * Available payment methods in PayStation
 */
export enum PaymentMethod {
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  UPAY = 'Upay',
  MASTERCARD = 'Mastercard',
  VISA = 'Visa'
}

/**
 * Transaction status values
 */
export type TransactionStatus = 'processing' | 'success' | 'failed' | 'refund';

/**
 * API response status
 */
export type ApiStatus = 'success' | 'failed';

/**
 * Response from payment initiation
 */
export interface InitiatePaymentResponse {
  /** Status code from PayStation API */
  statusCode: string;
  /** Success or failure status */
  status: ApiStatus;
  /** Response message */
  message: string;
  /** Payment amount (returned on success) */
  paymentAmount?: string;
  /** Invoice number (returned on success) */
  invoiceNumber?: string;
  /** Payment URL for redirect (returned on success) */
  paymentUrl?: string;
}

/**
 * Transaction data details
 */
export interface TransactionData {
  /** Invoice number for the transaction */
  invoiceNumber: string;
  /** Current status of the transaction */
  transactionStatus: TransactionStatus;
  /** PayStation transaction ID */
  transactionId: string;
  /** Payment amount */
  paymentAmount: string;
  /** Date and time when order was created */
  orderDateTime: string;
  /** Payer's mobile number (optional) */
  payerMobileNumber?: string;
  /** Payment method used (optional) */
  paymentMethod?: PaymentMethod;
  /** Reference information (optional) */
  reference?: string;
  /** Checkout items description (optional) */
  checkoutItems?: string;
  /** Transaction amount (for v2 API) */
  transactionAmount?: number;
  /** Transaction date (for v2 API) */
  transactionDate?: string;
  /** Requested amount (for v2 API) */
  requestAmount?: string;
}

/**
 * Response from transaction status check
 */
export interface TransactionStatusResponse {
  /** Status code from PayStation API */
  statusCode: string;
  /** Success or failure status */
  status: ApiStatus;
  /** Response message */
  message: string;
  /** Transaction data (returned on success) */
  data?: TransactionData;
}