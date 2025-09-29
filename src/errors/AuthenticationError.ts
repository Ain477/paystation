import { PayStationError } from './PayStationError';

/**
 * Error thrown when authentication or authorization fails
 */
export class AuthenticationError extends PayStationError {
  /**
   * Creates a new AuthenticationError
   * @param message - Authentication error message
   * @param statusCode - HTTP status code (optional)
   */
  constructor(
    message: string,
    statusCode?: string
  ) {
    super(message, statusCode);
    this.name = 'AuthenticationError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
  }
}