/**
 * HTTP request interface for internal use
 */
export interface HttpRequest {
  /** Request URL */
  url: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Request headers */
  headers: Record<string, string>;
  /** Request body */
  body?: string | FormData | URLSearchParams;
}

/**
 * HTTP response interface for internal use
 */
export interface HttpResponse {
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response data */
  data: unknown;
}