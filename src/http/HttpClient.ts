import { HttpRequest, HttpResponse } from '../types/http';
import { NetworkError } from '../errors/NetworkError';

/**
 * HTTP client that uses SWR's universal fetch for cross-environment compatibility
 */
export class HttpClient {
  private fetcher: (url: string, options?: RequestInit) => Promise<Response>;

  constructor(customFetcher?: (url: string, options?: RequestInit) => Promise<Response>) {
    this.fetcher = customFetcher || this.createSWRFetcher();
  }

  /**
   * Makes an HTTP request using SWR's universal fetch
   * @param request - The HTTP request to make
   * @returns Promise resolving to HTTP response
   * @throws NetworkError for network-related issues
   */
  async request(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requestInit: RequestInit = {
        method: request.method,
        headers: request.headers,
      };

      // Add body for non-GET requests
      if (request.body && request.method !== 'GET') {
        requestInit.body = request.body;
      }

      const response = await this.fetcher(request.url, requestInit);

      // Parse response data
      let data: unknown;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          throw new NetworkError(
            'Failed to parse JSON response',
            parseError as Error
          );
        }
      } else {
        data = await response.text();
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data,
      };
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error;
      }

      // Handle network errors (connection issues, timeouts, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(
          'Network request failed - please check your internet connection',
          error
        );
      }

      // Handle timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError(
          'Request timeout - the server took too long to respond',
          error
        );
      }

      // Generic network error
      throw new NetworkError(
        'An unexpected network error occurred',
        error as Error
      );
    }
  }

  /**
   * Creates a universal fetcher using SWR's approach
   * This works across browser, Node.js, and serverless environments
   */
  private createSWRFetcher(): (url: string, options?: RequestInit) => Promise<Response> {
    // SWR's universal fetch approach
    // In browser environments, use native fetch
    if (typeof window !== 'undefined' && window.fetch) {
      return window.fetch.bind(window);
    }

    // In Node.js environments, try to use node-fetch or native fetch (Node 18+)
    if (typeof global !== 'undefined') {
      // Try native fetch first (Node.js 18+)
      if (typeof fetch !== 'undefined') {
        return fetch;
      }

      // Fallback to dynamic import of node-fetch for older Node.js versions
      // This is handled by SWR internally, but we'll implement a basic version
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { default: fetch } = require('node-fetch');
        return fetch;
      } catch {
        // If node-fetch is not available, throw an error
        throw new NetworkError(
          'No fetch implementation available. Please install node-fetch for Node.js environments or use Node.js 18+'
        );
      }
    }

    // Fallback error
    throw new NetworkError(
      'Unsupported environment - no fetch implementation available'
    );
  }
}