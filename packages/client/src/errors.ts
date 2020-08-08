/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * This error is thrown when there is an API error with a payload. The error
 * body includes the data that came in the payload plus status and a server
 * message. When it's a rate limit error in includes `retryAfter`
 */
export class APIError extends Error {
  status: number;
  serverMessage: string;
  link?: string;
  action?: string;
  retryAfter: number | null | 'never';
  [key: string]: any;

  constructor(message: string, response: Response, body?: object) {
    super();
    this.message = `${message} (${response.status})`;
    this.status = response.status;
    this.serverMessage = message;
    this.retryAfter = null;

    if (body) {
      for (const field of Object.keys(body)) {
        if (field !== 'message') {
          // @ts-ignore
          this[field] = body[field];
        }
      }
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        this.retryAfter = parseInt(retryAfter, 10);
      }
    }
  }
}
