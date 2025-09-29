# Changelog

All notable changes to the PayStation TypeScript SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2024-09-30

### Fixed
- Fixed release script issues with dist folder in .gitignore
- Updated package.json scripts to work with automated publishing
- Improved release automation workflow

### Changed
- Removed dist folder from version control (built during CI/CD)
- Updated release script to handle changelog updates automatically

## [1.0.0] - 2024-09-30

### Added
- Initial release of PayStation TypeScript SDK
- Full TypeScript support with comprehensive type definitions
- Universal environment compatibility (browser, Node.js, serverless)
- Complete PayStation API integration for Hosted Checkout
- Payment initiation functionality with `initiatePayment()` method
- Transaction status checking with `getTransactionStatus()` and `getTransactionStatusById()` methods
- Comprehensive error handling with custom error classes:
  - `PayStationError` - Base error class
  - `ValidationError` - Parameter validation errors
  - `AuthenticationError` - Authentication failures
  - `NetworkError` - Network-related issues
- Environment configuration support (sandbox/live)
- SWR integration for universal fetch across all JavaScript environments
- Complete JSDoc documentation with examples
- Input validation with descriptive error messages
- Type-safe interfaces for all API requests and responses
- Payment method enums and transaction status types
- Automated npm publishing via GitHub Actions
- Comprehensive README with usage examples
- CI/CD pipeline with automated testing
- Release automation scripts

### Features
- **Payment Initiation**: Create payment requests with PayStation's Hosted Checkout
- **Transaction Status**: Check payment status by invoice number or transaction ID
- **Type Safety**: Full TypeScript support with strict type definitions
- **Error Handling**: Detailed error types for different failure scenarios
- **Environment Support**: Seamless operation across browser, Node.js, and serverless
- **Validation**: Comprehensive parameter validation with clear error messages
- **Documentation**: Complete API reference with usage examples

### Technical Details
- Built with rslib for optimal library bundling
- Multiple output formats (ESM, CJS) with TypeScript declarations
- Tree-shakeable exports for minimal bundle size
- SWR dependency for universal HTTP client functionality
- Comprehensive test suite with real API integration tests
- GitHub Actions workflows for CI/CD automation

### Documentation
- Complete API reference with all method signatures
- Usage examples for common integration patterns
- Error handling examples and best practices
- Environment-specific setup guides
- TypeScript usage examples with type imports
- Troubleshooting guide for common issues

[Unreleased]: https://github.com/ain477/paystation/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/ain477/paystation/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ain477/paystation/releases/tag/v1.0.0