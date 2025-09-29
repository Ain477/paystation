import { PayStationError } from './PayStationError';

/**
 * Error thrown when parameter validation fails
 */
export class ValidationError extends PayStationError {
  /**
   * Creates a new ValidationError
   * @param message - Validation error message
   * @param field - Field that failed validation (optional)
   */
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}