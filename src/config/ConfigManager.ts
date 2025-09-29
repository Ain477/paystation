import { PayStationConfig, Environment } from '../types/config';
import { ValidationError } from '../errors/ValidationError';

/**
 * Configuration manager for PayStation SDK
 * Handles environment URL mapping and configuration validation
 */
export class ConfigManager {
  private readonly config: PayStationConfig;
  
  private static readonly BASE_URLS = {
    [Environment.SANDBOX]: 'https://sandbox.paystation.com.bd/api',
    [Environment.LIVE]: 'https://api.paystation.com.bd'
  } as const;

  constructor(config: PayStationConfig) {
    this.validateConfig(config);
    this.config = { ...config };
  }

  /**
   * Get the base URL for the configured environment
   * @returns The base URL for API requests
   */
  getBaseUrl(): string {
    return ConfigManager.BASE_URLS[this.config.environment];
  }

  /**
   * Get the merchant ID
   * @returns The merchant ID
   */
  getMerchantId(): string {
    return this.config.merchantId;
  }

  /**
   * Get the password
   * @returns The password
   */
  getPassword(): string {
    return this.config.password;
  }

  /**
   * Get the environment
   * @returns The environment
   */
  getEnvironment(): Environment {
    return this.config.environment;
  }

  /**
   * Validate the configuration object
   * @param config - Configuration to validate
   * @throws {ValidationError} When configuration is invalid
   */
  validateConfig(config: PayStationConfig): void {
    if (!config) {
      throw new ValidationError('Configuration is required');
    }

    if (typeof config.merchantId !== 'string') {
      throw new ValidationError('merchantId is required and must be a non-empty string');
    }

    if (config.merchantId.trim().length === 0) {
      throw new ValidationError('merchantId cannot be empty or whitespace only');
    }

    if (typeof config.password !== 'string') {
      throw new ValidationError('password is required and must be a non-empty string');
    }

    if (config.password.trim().length === 0) {
      throw new ValidationError('password cannot be empty or whitespace only');
    }

    if (!config.environment) {
      throw new ValidationError('environment is required');
    }

    if (!Object.values(Environment).includes(config.environment)) {
      throw new ValidationError(
        `Invalid environment: ${config.environment}. Must be one of: ${Object.values(Environment).join(', ')}`
      );
    }
  }
}