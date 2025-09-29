/**
 * Base error class for all PayStation SDK errors
 */
export class PayStationError extends Error {
  /**
   * Creates a new PayStationError
   * @param message - Error message
   * @param statusCode - PayStation API status code (optional)
   * @param originalError - Original error that caused this error (optional)
   */
  constructor(
    message: string,
    public readonly statusCode?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'PayStationError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PayStationError);
    }
  }
}