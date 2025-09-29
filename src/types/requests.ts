/**
 * Parameters for initiating a payment
 */
export interface InitiatePaymentParams {
  /** Unique invoice number for the transaction */
  invoiceNumber: string;
  /** Currency code (optional) */
  currency?: string;
  /** Payment amount */
  paymentAmount: number;
  /** Payment amount including charges (optional) */
  payWithCharge?: number;
  /** Reference information (optional) */
  reference?: string;
  /** Customer's full name */
  customerName: string;
  /** Customer's phone number */
  customerPhone: string;
  /** Customer's email address */
  customerEmail: string;
  /** Customer's address (optional) */
  customerAddress?: string;
  /** URL to redirect after payment completion */
  callbackUrl: string;
  /** Checkout items description (optional) */
  checkoutItems?: string;
  /** Optional parameter A */
  optA?: string;
  /** Optional parameter B */
  optB?: string;
  /** Optional parameter C */
  optC?: string;
  /** EMI option (optional) */
  emi?: number;
}