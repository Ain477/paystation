import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PayStationSDK } from '../PayStationSDK';
import { Environment } from '../types/index';

// Mock the HTTP client to avoid real API calls
vi.mock('../http/HttpClient', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    request: vi.fn()
  }))
}));

describe('PayStationSDK', () => {
  let sdk: PayStationSDK;
  let mockHttpClient: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create SDK instance
    sdk = new PayStationSDK({
      merchantId: 'test-merchant',
      password: 'test-password',
      environment: Environment.SANDBOX
    });

    // Get the mocked HTTP client instance
    mockHttpClient = (sdk as any).httpClient;
  });

  describe('SDK Initialization', () => {
    it('should initialize without errors with valid configuration', () => {
      expect(() => {
        new PayStationSDK({
          merchantId: 'test-merchant',
          password: 'test-password',
          environment: Environment.SANDBOX
        });
      }).not.toThrow();
    });

    it('should initialize with live environment', () => {
      expect(() => {
        new PayStationSDK({
          merchantId: 'test-merchant',
          password: 'test-password',
          environment: Environment.LIVE
        });
      }).not.toThrow();
    });
  });

  describe('Payment Initiation', () => {
    it('should return expected response format for payment initiation', async () => {
      // Mock successful payment initiation response
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          statusCode: '200',
          status: 'success',
          message: 'Payment initiated successfully',
          paymentAmount: '100.00',
          invoiceNumber: 'INV-001',
          paymentUrl: 'https://sandbox.paystation.com.bd/checkout/payment-url'
        }
      };

      mockHttpClient.request.mockResolvedValue(mockResponse);

      const result = await sdk.initiatePayment({
        invoiceNumber: 'INV-001',
        paymentAmount: 100.00,
        customerName: 'John Doe',
        customerPhone: '+8801234567890',
        customerEmail: 'john@example.com',
        callbackUrl: 'https://example.com/callback'
      });

      // Verify response format
      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('paymentUrl');
      expect(result).toHaveProperty('invoiceNumber');
      expect(result).toHaveProperty('paymentAmount');

      // Verify response values
      expect(result.status).toBe('success');
      expect(result.invoiceNumber).toBe('INV-001');
      expect(result.paymentAmount).toBe('100.00');
      expect(result.paymentUrl).toContain('paystation.com.bd');
    });
  });

  describe('Transaction Status Checking', () => {
    it('should return expected response format for transaction status by invoice', async () => {
      // Mock successful transaction status response
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          statusCode: '200',
          status: 'success',
          message: 'Transaction found',
          data: {
            invoiceNumber: 'INV-001',
            transactionStatus: 'success',
            transactionId: 'TXN123456789',
            paymentAmount: '100.00',
            orderDateTime: '2024-01-01 12:00:00',
            paymentMethod: 'bKash'
          }
        }
      };

      mockHttpClient.request.mockResolvedValue(mockResponse);

      const result = await sdk.getTransactionStatus('INV-001');

      // Verify response format
      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');

      // Verify transaction data format
      expect(result.data).toHaveProperty('invoiceNumber');
      expect(result.data).toHaveProperty('transactionStatus');
      expect(result.data).toHaveProperty('transactionId');
      expect(result.data).toHaveProperty('paymentAmount');
      expect(result.data).toHaveProperty('orderDateTime');

      // Verify response values
      expect(result.status).toBe('success');
      expect(result.data?.invoiceNumber).toBe('INV-001');
      expect(result.data?.transactionStatus).toBe('success');
    });

    it('should return expected response format for transaction status by ID', async () => {
      // Mock successful transaction status by ID response
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          statusCode: '200',
          status: 'success',
          message: 'Transaction found',
          data: {
            invoiceNumber: 'INV-001',
            transactionStatus: 'success',
            transactionId: 'TXN123456789',
            transactionAmount: 100.00,
            transactionDate: '2024-01-01',
            requestAmount: '100.00'
          }
        }
      };

      mockHttpClient.request.mockResolvedValue(mockResponse);

      const result = await sdk.getTransactionStatusById('TXN123456789');

      // Verify response format
      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');

      // Verify transaction data format
      expect(result.data).toHaveProperty('transactionId');
      expect(result.data).toHaveProperty('transactionStatus');
      expect(result.data).toHaveProperty('transactionAmount');
      expect(result.data).toHaveProperty('transactionDate');

      // Verify response values
      expect(result.status).toBe('success');
      expect(result.data?.transactionId).toBe('TXN123456789');
      expect(result.data?.transactionStatus).toBe('success');
    });
  });
});