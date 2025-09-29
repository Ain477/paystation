/**
 * PayStation SDK configuration interface
 */
export interface PayStationConfig {
  /** Merchant ID provided by PayStation */
  merchantId: string;
  /** Password provided by PayStation */
  password: string;
  /** Environment to use - defaults to sandbox */
  environment: Environment;
}

/**
 * Available PayStation environments
 */
export enum Environment {
  SANDBOX = 'sandbox',
  LIVE = 'live'
}