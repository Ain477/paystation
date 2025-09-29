# PayStation TypeScript SDK

A comprehensive TypeScript SDK for integrating PayStation's Hosted Checkout API into your applications. This SDK provides a simple, type-safe interface for payment processing with full support for both sandbox and live environments.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🌍 **Universal Compatibility**: Works in browser, Node.js, and serverless environments
- 🛡️ **Error Handling**: Detailed error types for different failure scenarios
- ✅ **Input Validation**: Comprehensive parameter validation with descriptive error messages
- 🧪 **Testing Ready**: Built-in sandbox environment support for development and testing
- 📚 **Well Documented**: Complete JSDoc documentation with examples

## Installation

Install the SDK using npm or yarn:

```bash
# Using npm
npm install paystation

# Using yarn
yarn add paystation
```



## Quick Start

### Basic Setup

```typescript
import { PayStationSDK, Environment } from 'paystation';

// Initialize SDK for sandbox testing
const paystation = new PayStationSDK({
  merchantId: 'your-merchant-id',
  password: 'your-password',
  environment: Environment.SANDBOX
});
```

### Initiate a Payment

```typescript
try {
  const paymentResponse = await paystation.initiatePayment({
    invoiceNumber: 'INV-001',
    paymentAmount: 100.50,
    customerName: 'John Doe',
    customerPhone: '+8801234567890',
    customerEmail: 'john@example.com',
    callbackUrl: 'https://yoursite.com/callback'
  });

  // Redirect customer to PayStation's hosted checkout
  if (paymentResponse.status === 'success' && paymentResponse.paymentUrl) {
    window.location.href = paymentResponse.paymentUrl;
  }
} catch (error) {
  console.error('Payment initiation failed:', error.message);
}
```

### Check Transaction Status

```typescript
try {
  const status = await paystation.getTransactionStatus('INV-001');
  
  if (status.data) {
    console.log('Transaction Status:', status.data.transactionStatus);
    console.log('Payment Method:', status.data.paymentMethod);
    
    if (status.data.transactionStatus === 'success') {
      console.log('Payment completed successfully!');
    }
  }
} catch (error) {
  console.error('Status check failed:', error.message);
}
```

## Configuration

### Configuration Options

The SDK requires the following configuration parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchantId` | `string` | Yes | Your unique merchant identifier provided by PayStation |
| `password` | `string` | Yes | Your merchant password provided by PayStation |
| `environment` | `Environment` | Yes | Environment to use (`Environment.SANDBOX` or `Environment.LIVE`) |

### Environment Configuration

```typescript
import { PayStationSDK, Environment } from 'paystation';

// Sandbox environment (for testing)
const sandboxPaystation = new PayStationSDK({
  merchantId: 'your-sandbox-merchant-id',
  password: 'your-sandbox-password',
  environment: Environment.SANDBOX
});

// Live environment (for production)
const livePaystation = new PayStationSDK({
  merchantId: 'your-live-merchant-id',
  password: 'your-live-password',
  environment: Environment.LIVE
});
```

### Environment Effects

- **Sandbox Environment**: All transactions are test transactions and no real money is processed
- **Live Environment**: All transactions are real and will process actual payments
- **URL Mapping**: Environment automatically determines the correct PayStation API base URL

## API Reference

### PayStationSDK Class

#### Constructor

```typescript
new PayStationSDK(config: PayStationConfig)
```

Creates a new PayStation SDK instance.

**Parameters:**
- `config.merchantId` (string): Merchant ID provided by PayStation
- `config.password` (string): Password provided by PayStation  
- `config.environment` (Environment): Environment to use ('sandbox' or 'live')

**Throws:**
- `ValidationError`: When configuration is invalid or missing required fields

#### initiatePayment()

```typescript
async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResponse>
```

Initiates a payment with PayStation's Hosted Checkout.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `invoiceNumber` | `string` | Yes | Unique invoice number for the transaction |
| `paymentAmount` | `number` | Yes | Payment amount (must be greater than 0) |
| `customerName` | `string` | Yes | Customer's full name |
| `customerPhone` | `string` | Yes | Customer's phone number |
| `customerEmail` | `string` | Yes | Customer's email address |
| `callbackUrl` | `string` | Yes | URL to redirect after payment completion |
| `currency` | `string` | No | Currency code |
| `payWithCharge` | `number` | No | Payment amount including charges |
| `reference` | `string` | No | Reference information |
| `customerAddress` | `string` | No | Customer's address |
| `checkoutItems` | `string` | No | Checkout items description |
| `optA` | `string` | No | Optional parameter A |
| `optB` | `string` | No | Optional parameter B |
| `optC` | `string` | No | Optional parameter C |
| `emi` | `number` | No | EMI option |

**Returns:**
- `Promise<InitiatePaymentResponse>`: Payment initiation response containing payment URL

**Throws:**
- `ValidationError`: When required parameters are missing or invalid
- `AuthenticationError`: When merchant credentials are invalid
- `NetworkError`: When network request fails
- `PayStationError`: When PayStation API returns an error

#### getTransactionStatus()

```typescript
async getTransactionStatus(invoiceNumber: string): Promise<TransactionStatusResponse>
```

Retrieves transaction status by invoice number.

**Parameters:**
- `invoiceNumber` (string): Invoice number to check status for

**Returns:**
- `Promise<TransactionStatusResponse>`: Transaction status response with transaction details

**Throws:**
- `ValidationError`: When invoice number is invalid or empty
- `AuthenticationError`: When merchant credentials are invalid
- `NetworkError`: When network request fails
- `PayStationError`: When PayStation API returns an error or transaction not found

#### getTransactionStatusById()

```typescript
async getTransactionStatusById(transactionId: string): Promise<TransactionStatusResponse>
```

Retrieves transaction status by PayStation transaction ID.

**Parameters:**
- `transactionId` (string): PayStation transaction ID to check status for

**Returns:**
- `Promise<TransactionStatusResponse>`: Transaction status response with detailed transaction information

**Throws:**
- `ValidationError`: When transaction ID is invalid or empty
- `AuthenticationError`: When merchant credentials are invalid
- `NetworkError`: When network request fails
- `PayStationError`: When PayStation API returns an error or transaction not found

### Type Definitions

#### PayStationConfig

```typescript
interface PayStationConfig {
  merchantId: string;
  password: string;
  environment: Environment;
}
```

#### Environment

```typescript
enum Environment {
  SANDBOX = 'sandbox',
  LIVE = 'live'
}
```

#### InitiatePaymentParams

```typescript
interface InitiatePaymentParams {
  invoiceNumber: string;
  currency?: string;
  paymentAmount: number;
  payWithCharge?: number;
  reference?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  callbackUrl: string;
  checkoutItems?: string;
  optA?: string;
  optB?: string;
  optC?: string;
  emi?: number;
}
```

#### InitiatePaymentResponse

```typescript
interface InitiatePaymentResponse {
  statusCode: string;
  status: 'success' | 'failed';
  message: string;
  paymentAmount?: string;
  invoiceNumber?: string;
  paymentUrl?: string;
}
```

#### TransactionStatusResponse

```typescript
interface TransactionStatusResponse {
  statusCode: string;
  status: 'success' | 'failed';
  message: string;
  data?: TransactionData;
}
```

#### TransactionData

```typescript
interface TransactionData {
  invoiceNumber: string;
  transactionStatus: 'processing' | 'success' | 'failed' | 'refund';
  transactionId: string;
  paymentAmount: string;
  orderDateTime: string;
  payerMobileNumber?: string;
  paymentMethod?: PaymentMethod;
  reference?: string;
  checkoutItems?: string;
  transactionAmount?: number;
  transactionDate?: string;
  requestAmount?: string;
}
```

#### PaymentMethod

```typescript
enum PaymentMethod {
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  UPAY = 'Upay',
  MASTERCARD = 'Mastercard',
  VISA = 'Visa'
}
```

## Complete Usage Examples

### Full Payment Flow Example

```typescript
import { PayStationSDK, Environment, PayStationError, ValidationError, AuthenticationError, NetworkError } from 'paystation';

class PaymentService {
  private paystation: PayStationSDK;

  constructor() {
    this.paystation = new PayStationSDK({
      merchantId: process.env.PAYSTATION_MERCHANT_ID!,
      password: process.env.PAYSTATION_PASSWORD!,
      environment: process.env.NODE_ENV === 'production' ? Environment.LIVE : Environment.SANDBOX
    });
  }

  async createPayment(orderData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: string;
  }) {
    try {
      const response = await this.paystation.initiatePayment({
        invoiceNumber: orderData.orderId,
        paymentAmount: orderData.amount,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        callbackUrl: `${process.env.BASE_URL}/payment/callback`,
        reference: `Order ${orderData.orderId}`,
        checkoutItems: orderData.items
      });

      if (response.status === 'success' && response.paymentUrl) {
        return {
          success: true,
          paymentUrl: response.paymentUrl,
          invoiceNumber: response.invoiceNumber
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  }

  async verifyPayment(invoiceNumber: string) {
    try {
      const status = await this.paystation.getTransactionStatus(invoiceNumber);
      
      if (status.data) {
        return {
          success: status.data.transactionStatus === 'success',
          status: status.data.transactionStatus,
          transactionId: status.data.transactionId,
          paymentMethod: status.data.paymentMethod,
          amount: status.data.paymentAmount,
          date: status.data.orderDateTime
        };
      }
      
      throw new Error('Transaction data not found');
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }
}
```

### Express.js Integration Example

```typescript
import express from 'express';
import { PayStationSDK, Environment } from 'paystation';

const app = express();
app.use(express.json());

const paystation = new PayStationSDK({
  merchantId: process.env.PAYSTATION_MERCHANT_ID!,
  password: process.env.PAYSTATION_PASSWORD!,
  environment: Environment.SANDBOX
});

// Create payment endpoint
app.post('/api/payments/create', async (req, res) => {
  try {
    const { orderId, amount, customer } = req.body;
    
    const response = await paystation.initiatePayment({
      invoiceNumber: orderId,
      paymentAmount: amount,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      callbackUrl: `${req.protocol}://${req.get('host')}/api/payments/callback`
    });

    res.json({
      success: true,
      paymentUrl: response.paymentUrl
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Payment callback endpoint
app.post('/api/payments/callback', async (req, res) => {
  try {
    const { invoice_number } = req.body;
    
    const status = await paystation.getTransactionStatus(invoice_number);
    
    if (status.data?.transactionStatus === 'success') {
      // Update your database, send confirmation emails, etc.
      console.log('Payment successful:', status.data);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Callback processing failed:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### React.js Integration Example

```typescript
import React, { useState } from 'react';
import { PayStationSDK, Environment, ValidationError, PayStationError } from 'paystation';

const paystation = new PayStationSDK({
  merchantId: process.env.REACT_APP_PAYSTATION_MERCHANT_ID!,
  password: process.env.REACT_APP_PAYSTATION_PASSWORD!,
  environment: Environment.SANDBOX
});

interface PaymentFormProps {
  orderId: string;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId, amount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await paystation.initiatePayment({
        invoiceNumber: orderId,
        paymentAmount: amount,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        callbackUrl: `${window.location.origin}/payment/callback`
      });

      if (response.status === 'success' && response.paymentUrl) {
        // Redirect to PayStation
        window.location.href = response.paymentUrl;
      } else {
        setError(response.message);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        setError(`Validation Error: ${error.message}`);
      } else if (error instanceof PayStationError) {
        setError(`Payment Error: ${error.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={customerData.name}
          onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={customerData.phone}
          onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={customerData.email}
          onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
          required
        />
      </div>

      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
```

## Error Handling

The SDK provides specific error types for different failure scenarios:

### Error Types

- **`PayStationError`**: Base error class for all SDK errors
- **`ValidationError`**: For parameter validation failures
- **`AuthenticationError`**: For authentication/authorization failures  
- **`NetworkError`**: For network-related issues

### Error Handling Examples

```typescript
import { 
  PayStationSDK, 
  PayStationError, 
  ValidationError, 
  AuthenticationError, 
  NetworkError 
} from 'paystation';

try {
  const response = await paystation.initiatePayment(params);
  // Handle success
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors (invalid parameters)
    console.error('Invalid parameters:', error.message);
    // Show user-friendly validation message
  } else if (error instanceof AuthenticationError) {
    // Handle authentication errors (invalid credentials)
    console.error('Authentication failed:', error.message);
    // Check merchant credentials
  } else if (error instanceof NetworkError) {
    // Handle network errors (connection issues)
    console.error('Network error:', error.message);
    // Retry or show network error message
  } else if (error instanceof PayStationError) {
    // Handle PayStation API errors
    console.error('PayStation API error:', error.message);
    console.error('Status code:', error.statusCode);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Scenarios

```typescript
// Validation Error Example
try {
  await paystation.initiatePayment({
    invoiceNumber: '', // Empty invoice number
    paymentAmount: -10, // Negative amount
    customerEmail: 'invalid-email' // Invalid email format
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
  }
}

// Authentication Error Example
const invalidPaystation = new PayStationSDK({
  merchantId: 'invalid-merchant',
  password: 'wrong-password',
  environment: Environment.SANDBOX
});

try {
  await invalidPaystation.initiatePayment(validParams);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid credentials:', error.message);
  }
}

// Network Error Example
try {
  // This might fail due to network issues
  await paystation.getTransactionStatus('INV-001');
} catch (error) {
  if (error instanceof NetworkError) {
    console.log('Network issue:', error.message);
    // Implement retry logic
  }
}
```

## TypeScript Usage

### Type Imports

```typescript
import { 
  PayStationSDK, 
  Environment,
  PayStationConfig,
  InitiatePaymentParams,
  InitiatePaymentResponse,
  TransactionStatusResponse,
  TransactionData,
  PaymentMethod,
  PayStationError,
  ValidationError,
  AuthenticationError,
  NetworkError
} from 'paystation';
```

### Interface Usage Examples

```typescript
// Configuration with type safety
const config: PayStationConfig = {
  merchantId: 'your-merchant-id',
  password: 'your-password',
  environment: Environment.SANDBOX
};

// Payment parameters with type safety
const paymentParams: InitiatePaymentParams = {
  invoiceNumber: 'INV-001',
  paymentAmount: 100.50,
  customerName: 'John Doe',
  customerPhone: '+8801234567890',
  customerEmail: 'john@example.com',
  callbackUrl: 'https://yoursite.com/callback',
  reference: 'Order #12345',
  checkoutItems: 'Product A x1'
};

// Response handling with type safety
const handlePaymentResponse = (response: InitiatePaymentResponse) => {
  if (response.status === 'success') {
    console.log('Payment URL:', response.paymentUrl);
    console.log('Invoice:', response.invoiceNumber);
  } else {
    console.error('Payment failed:', response.message);
  }
};

// Transaction status handling with type safety
const handleTransactionStatus = (response: TransactionStatusResponse) => {
  if (response.data) {
    const { transactionStatus, paymentMethod, paymentAmount } = response.data;
    
    switch (transactionStatus) {
      case 'success':
        console.log(`Payment successful via ${paymentMethod}: ${paymentAmount}`);
        break;
      case 'processing':
        console.log('Payment is still processing...');
        break;
      case 'failed':
        console.log('Payment failed');
        break;
      case 'refund':
        console.log('Payment was refunded');
        break;
    }
  }
};
```

## Environment Compatibility

The SDK is designed to work seamlessly across different JavaScript environments:

### Browser Environment

```html
<!-- Using ES modules -->
<script type="module">
  import { PayStationSDK, Environment } from 'paystation';
  
  const paystation = new PayStationSDK({
    merchantId: 'your-merchant-id',
    password: 'your-password',
    environment: Environment.SANDBOX
  });
</script>
```

### Node.js Environment

```typescript
// CommonJS
const { PayStationSDK, Environment } = require('paystation');

// ES Modules
import { PayStationSDK, Environment } from 'paystation';

const paystation = new PayStationSDK({
  merchantId: process.env.PAYSTATION_MERCHANT_ID!,
  password: process.env.PAYSTATION_PASSWORD!,
  environment: Environment.SANDBOX
});
```

### Serverless Environment (AWS Lambda, Vercel, Netlify)

```typescript
import { PayStationSDK, Environment } from 'paystation';

export const handler = async (event: any) => {
  const paystation = new PayStationSDK({
    merchantId: process.env.PAYSTATION_MERCHANT_ID!,
    password: process.env.PAYSTATION_PASSWORD!,
    environment: Environment.LIVE
  });

  try {
    const response = await paystation.initiatePayment({
      invoiceNumber: event.orderId,
      paymentAmount: event.amount,
      customerName: event.customer.name,
      customerPhone: event.customer.phone,
      customerEmail: event.customer.email,
      callbackUrl: event.callbackUrl
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentUrl: response.paymentUrl
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
```

### Environment Requirements

- **Browser**: Modern browsers with ES2017+ support
- **Node.js**: Version 14.0.0 or higher
- **Serverless**: Compatible with all major serverless platforms

## Troubleshooting

### Common Issues and Solutions

#### 1. Installation Issues

**Problem**: Package installation fails or SDK doesn't work after installation.

**Solution**:
```bash
# Reinstall the package to ensure clean installation
npm install paystation
# or
yarn add paystation
```

#### 2. Authentication Errors

**Problem**: Getting `AuthenticationError` when making API calls.

**Solutions**:
- Verify your merchant ID and password are correct
- Ensure you're using the right credentials for the environment (sandbox vs live)
- Check that your PayStation account is active and properly configured

```typescript
// Double-check your credentials
const paystation = new PayStationSDK({
  merchantId: 'your-actual-merchant-id', // Not placeholder text
  password: 'your-actual-password',      // Not placeholder text
  environment: Environment.SANDBOX       // Use correct environment
});
```

#### 3. Validation Errors

**Problem**: Getting `ValidationError` for seemingly valid parameters.

**Solutions**:
- Ensure email addresses are in valid format
- Check that phone numbers include country code
- Verify payment amounts are positive numbers
- Ensure callback URLs are valid HTTP/HTTPS URLs

```typescript
// Correct parameter format
const params = {
  invoiceNumber: 'INV-001',           // Non-empty string
  paymentAmount: 100.50,              // Positive number
  customerEmail: 'user@example.com',  // Valid email format
  customerPhone: '+8801234567890',    // Include country code
  callbackUrl: 'https://yoursite.com/callback' // Valid HTTPS URL
};
```

#### 4. Network Timeouts

**Problem**: Requests timing out or failing due to network issues.

**Solutions**:
- Check your internet connection
- Verify PayStation API endpoints are accessible
- Implement retry logic for network failures

```typescript
const retryPayment = async (params: InitiatePaymentParams, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await paystation.initiatePayment(params);
    } catch (error) {
      if (error instanceof NetworkError && attempt < maxRetries) {
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      throw error;
    }
  }
};
```

#### 5. TypeScript Compilation Errors

**Problem**: TypeScript compilation fails with type errors.

**Solutions**:
- Ensure you're using TypeScript 4.0 or higher
- Check that all required parameters are provided
- Verify imported types are correct

```typescript
// Ensure proper type imports
import type { 
  PayStationConfig, 
  InitiatePaymentParams 
} from 'paystation';

// Use proper typing
const config: PayStationConfig = {
  merchantId: 'your-merchant-id',
  password: 'your-password',
  environment: Environment.SANDBOX
};
```

#### 6. Environment Compatibility Issues

**Problem**: SDK not working in specific environments.

**Solutions**:
- Ensure your environment supports modern JavaScript features (ES2017+)
- Check that your runtime environment is supported (Node.js 14+, modern browsers)
- Verify network connectivity to PayStation API endpoints

#### 7. Transaction Status "Not Found"

**Problem**: Getting errors when checking transaction status.

**Solutions**:
- Verify the invoice number or transaction ID is correct
- Ensure sufficient time has passed for transaction processing
- Check that the transaction was created successfully

```typescript
// Wait before checking status
const checkStatusWithDelay = async (invoiceNumber: string) => {
  // Wait a few seconds for transaction to be processed
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    return await paystation.getTransactionStatus(invoiceNumber);
  } catch (error) {
    if (error instanceof PayStationError) {
      console.log('Transaction may still be processing...');
    }
    throw error;
  }
};
```

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// Enable console logging for debugging
const debugPaystation = new PayStationSDK({
  merchantId: 'your-merchant-id',
  password: 'your-password',
  environment: Environment.SANDBOX
});

// Wrap API calls with detailed logging
const debugApiCall = async (operation: string, apiCall: () => Promise<any>) => {
  console.log(`[PayStation] Starting ${operation}...`);
  try {
    const result = await apiCall();
    console.log(`[PayStation] ${operation} successful:`, result);
    return result;
  } catch (error) {
    console.error(`[PayStation] ${operation} failed:`, error);
    throw error;
  }
};

// Usage
const response = await debugApiCall('Payment Initiation', () =>
  paystation.initiatePayment(params)
);
```

## Links and Resources

### PayStation Documentation
- [PayStation API Documentation](https://paystation.com.bd/documentation)

### Support Resources
- [PayStation Support Center](https://paystation.com.bd/#contact)
- Email: info@paystation.com.bd
- Phone: 09613820890

### SDK Resources
- [GitHub Repository](https://github.com/Ain477/paystation)
- [Issue Tracker](https://github.com/Ain477/paystation/issues)

## Contributing

We welcome contributions to improve the PayStation TypeScript SDK! Here's how you can contribute:

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ain477/paystation.git
   cd paystation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

### Development Scripts

- `npm run test` - Run all tests
- `npm run build` - Build the library for production
- `npm run type-check` - Run TypeScript type checking

### Testing

The SDK includes comprehensive test suites covering unit tests, integration tests, and environment compatibility tests. All tests are run automatically during development to ensure reliability.

### Contribution Guidelines

1. **Fork the repository** and create a feature branch
2. **Write tests** for any new functionality
3. **Ensure all tests pass** before submitting
4. **Follow TypeScript best practices** and maintain type safety
5. **Update documentation** for any API changes
6. **Submit a pull request** with a clear description of changes

### Code Style

- Use TypeScript for all code
- Follow existing code formatting and style
- Include JSDoc comments for all public APIs
- Maintain 100% type safety (no `any` types)
- Write comprehensive tests for new features

### Reporting Issues

If you encounter any issues:

1. **Check existing issues** to avoid duplicates
2. **Provide detailed reproduction steps**
3. **Include environment information** (Node.js version, browser, etc.)
4. **Share relevant code snippets** and error messages
5. **Use issue templates** when available

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 PayStation SDK Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Changelog

### Version 1.0.0
- Initial release
- Full TypeScript support with comprehensive type definitions
- Universal environment compatibility (browser, Node.js, serverless)
- Complete PayStation API integration
- Comprehensive error handling
- Full test coverage
- Complete documentation

---

**Made with ❤️ for the PayStation developer community**