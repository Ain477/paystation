import { PayStationError } from './PayStationError';

/**
 * Error thrown when network-related issues occur
 */
export class NetworkError extends PayStationError {
  /**
   * Creates a new NetworkError
   * @param message - Network error message
   * @param originalError - Original network error (optional)
   */
  constructor(
    message: string,
    originalError?: Error
  ) {
    super(message, undefined, originalError);
    this.name = 'NetworkError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}