/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Form } from './types/Form';
import qs from 'query-string';
import { deepMerge } from '@formium/utils';
/**
 * Create a wrapper around fetch() with API base URL and default headers.
 *
 * @param fetchImplementation - Fetch implmementation (useful of debugging/testing)
 * @param baseUrl - Base API URL
 *
 * @internal
 */
export function _createFetcher(
  baseUrl: string,
  fetchImplementation: typeof fetch,
  apiToken?: string
) {
  return function fetcher(endpoint: string, options: RequestInit = {}) {
    const opts = {
      headers: {
        'X-Formik-Client': '@formium/client',
        'X-Formik-Client-Version': __VERSION__,
        Authorization: `Bearer ${apiToken}`,
      },
    };
    return fetchImplementation(baseUrl + endpoint, deepMerge(opts, options));
  };
}

/**
 * Formium Client options
 *
 * @public
 */
export interface Options {
  /** Base URL */
  baseUrl?: string;
  /** Custom fetch implementation (useful for mocking) */
  fetchImplementation?: any;
  /** API token */
  apiToken?: string;
}

/**
 * Submission data.
 *
 * @remarks
 * This can either be a plain JavaScript object or `FormData`. If `FormData` contains files,
 * the submission will be rejected. If your form contains file uploads, please upload them using `formium.uploadFile(formSlug, file)` first, and store the returned URL. For more information about uploads, please refer to `formium.uploadFile`.
 *
 * For security, Formium upholds the following limits on data that you should be aware of:
 *   - The following keys are banned: `pass`, `password`, `pw`, `ssn`, `cc`, `creditCard`, `credit_card`, `creditcard`, `cardNumber`, `cardnumber`, `card_number`.
 *   - Objects with data deeper than 3 levels of nesting will be stringified
 *   - All keys must be shorter than 32 characters
 *   - JSON payloads must be less than 5KB for non-enterprise users
 *
 * Calling `submiForm` with `FormData` instead of an JavaScript object works as well. In addition, if your form contains `<select multiple>`, that value will
 * be automatically converted to an array of strings instead of a comma-delimited string. This is for your convenience.
 *
 * @public
 */
export type SubmitData = Record<string, any> | FormData;

/**
 * Submission JSON response shape.
 *
 * @public
 */
export interface SubmitSuccess {
  /** Was the submission successful? */
  ok: boolean;
}

/**
 * HTTP client returned by fetch factory
 *
 * @internal
 */
export type _Fetcher = ReturnType<typeof _createFetcher>;

/**
 * Formium Client
 *
 * @public
 */
export class FormiumClient {
  /** Project ID */
  projectId: string;
  /** API endpoint */
  baseUrl: string;
  /**  Internal HTTP client */
  _fetcher: _Fetcher;

  constructor(projectId: string, options?: Options) {
    this.projectId = projectId;
    this.baseUrl = options?.baseUrl ?? 'https://api.formium.io';
    this._fetcher = _createFetcher(
      this.baseUrl,
      options?.fetchImplementation ?? fetch,
      options?.apiToken
    );
  }

  /**
   * Return a forms in a project
   *
   * @param query - Query parameters
   * @param fetchOptions - Additional request options
   * @public
   */
  findForms(
    query?: {
      actionId?: string;
      from?: string;
      limit?: number;
    },
    fetchOptions?: RequestInit
  ): Promise<{
    data: Form[];
    next?: string;
  }> {
    let url =
      `/v1/form?` + qs.stringify({ projectId: this.projectId, ...query });
    return this._fetcher(
      url,
      deepMerge(
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        fetchOptions
      )
    ).then(res => res.json());
  }

  /**
   * Return a Form based on its slug and projectId
   *
   * @param formSlug - form slug
   * @param query - Query parameters
   * @param fetchOptions - Additional request options
   * @public
   */
  getFormBySlug(
    formSlug: string,
    query?: { revisionId?: string },
    fetchOptions?: RequestInit
  ): Promise<Form> {
    let url = `/v1/form/id/${this.projectId}/${formSlug}`;
    let headers = {};
    if (query && query.revisionId) {
      headers = {
        'X-Formik-Revision': query.revisionId,
      };
    }

    return this._fetcher(
      url,
      deepMerge(
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        },
        fetchOptions
      )
    ).then(res => res.json());
  }

  /**
   * Return a Form given its ID
   *
   * @param formSlug - form slug
   * @param query - Query parameters
   * @param fetchOptions - Additional request options
   * @public
   */
  getFormById(
    id: string,
    query?: { revisionId?: string },
    fetchOptions?: RequestInit
  ): Promise<Form> {
    let url = `/v1/form/${id}`;
    let headers = {};
    if (query && query.revisionId) {
      headers = {
        'X-Formik-Revision': query.revisionId,
      };
    }
    return this._fetcher(
      url,
      deepMerge(
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        },
        fetchOptions
      )
    ).then(res => res.json());
  }

  /**
   * Submit data to Formium Form
   *
   * @param formSlug - Slug of the form
   * @param data - An object or FormData instance containing submission data.
   *
   * @public
   */
  submitForm(formSlug: string, data: SubmitData) {
    let values: string;
    // Convert form data into object and handle arrays (i.e. select multiple)
    if (data instanceof FormData) {
      let obj: Record<string, any> = {};
      for (const [key, value] of (data as FormData) as any) {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = value;
          continue;
        }
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      }
      values = JSON.stringify(obj);
    } else {
      values = JSON.stringify(data);
    }

    return this._fetcher(`/submit/${this.projectId}/${formSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: values,
    }).then(res => res.json());
  }

  /**
   * Upload a file to Formium. All uploads are private by default.
   *
   * @param formSlug - Slug of the Form
   * @param file - File to be uploaded
   *
   * @returns URI of the uploaded file
   */
  uploadFile(formSlug: string, file: File): Promise<string | null> {
    let data = new FormData();
    data.append('file', file);
    return this._fetcher(`/submit/${this.projectId}/${formSlug}/upload`, {
      method: 'POST',
      body: data,
    }).then(res => res.headers.get('Location'));
  }
}

/**
 * Create a new Formium API client
 *
 * @param projectSlug - Project slug
 * @param options - Client options
 *
 * @returns FormiumClient
 * @public
 */
export function createClient(
  projectSlug: string,
  options?: Options
): FormiumClient {
  return new FormiumClient(projectSlug, options);
}

export * from './types/Form';
export * from './types/FormKey';
export * from './types/FormElement';
export * from './types/FormElementAction';
export * from './types/FormElementActionDetails';
export * from './types/FormElementActionDetailsTo';
export * from './types/FormSchema';
