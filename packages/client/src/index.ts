/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Form } from './types/Form';
import { User } from './types/User';
import { Project } from './types/Project';
import { APIError } from './errors';
import qs from 'query-string';

/**
 * Create a wrapper around fetch() with API base URL and default headers.
 *
 * @param fetchImplementation - Fetch implmementation (useful of debugging/testing)
 * @param baseUrl - Base API URL
 *
 * @public
 */
export function _createFetcher(
  baseUrl: string,
  fetchImplementation: typeof fetch,
  apiToken?: string
) {
  return function fetcher(endpoint: string, options: RequestInit = {}) {
    let opts = options;
    opts.headers = options.headers || {};
    (opts.headers as any)['X-Formik-Client'] = '@formium/client';
    (opts.headers as any)['X-Formik-Client-Version'] = __VERSION__;
    if (apiToken) {
      (opts.headers as any).Authorization = `Bearer ${apiToken}`;
    }

    return fetchImplementation(baseUrl + endpoint, opts).then(async res => {
      if (res.ok) {
        if (!res.headers.get('content-type')) {
          return;
        }
        return res.headers.get('content-type')!.includes('application/json')
          ? await res.json()
          : res;
      }

      let bodyError;
      let body = await res.json();

      // Some APIs wrongly return `err` instead of `error`
      bodyError = body.error || body.err || body;

      const msg = bodyError?.message || 'Response Error';

      return Promise.reject(new APIError(msg, res, bodyError));
    });
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
 * @public
 */
export type _Fetcher = (
  endpoint: string,
  options?: RequestInit
) => Promise<any>;

/**
 * Results of paginated resource request
 * @public
 */
export type Results<T> = {
  /** List of results returned */
  data: T[];
  /** Identifier to return the next item in the sequence */
  next?: string;
};

/**
 * Paginated resource query
 * @public
 */
export interface PaginatedQuery {
  /**
   * Pagination cursor id
   */
  from?: string;
  /**
   * Number of results to return. Max is 100.
   */
  limit?: number;
}
/** @public */
export interface FindFormsQuery extends PaginatedQuery {
  /** With given action id */
  actionId?: string;
  /** Return forms that have been updated starting at this date */
  updateStartAt?: string;
}

/** @public */
export interface GetFormQuery {
  /** The id of the revision */
  revisionId?: string;
}

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
   * Return forms in a project
   *
   * @param query - Query parameters
   * @param fetchOptions - Additional request options
   *
   * @result A list of forms
   * @public
   */
  findForms(
    query?: FindFormsQuery,
    fetchOptions?: RequestInit
  ): Promise<Results<Form>> {
    let url =
      `/v1/form?` + qs.stringify({ projectId: this.projectId, ...query });
    return this._fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });
  }

  /**
   * Return the current user (based on the token)
   *
   * @public
   */
  getMe(fetchOptions?: RequestInit): Promise<User> {
    let url = `/v1/user/me`;
    return this._fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });
  }

  /**
   * Return a Project by id
   *
   *
   * ```jsx
   * client.getProjectById('your_project_id')
   *   .then(project => {
   *     console.log(project)
   *    })
   *   .catch(error => console.log(error))
   * ```
   *
   * @param id - Project Id
   * @param fetchOptions - fetch overrides
   * @public
   */
  getProject(id: string, fetchOptions?: RequestInit): Promise<Project> {
    let url = `/v1/project/` + id;

    return this._fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });
  }

  /**
   * Retrieve the projects the user belongs to
   *
   * @public
   */
  getMyProjects(fetchOptions?: RequestInit): Promise<Results<Project>> {
    let url = `/v1/project/me`;
    return this._fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });
  }

  /**
   * Delete the current Oauth2 bearer token (for signout)
   *
   * @public
   */
  logout(fetchOptions?: RequestInit) {
    let url = `/oauth/token/me`;
    return this._fetcher(url, {
      method: 'DELETE',
      ...fetchOptions,
    });
  }

  /**
   * Return a project by slug
   *
   * @public
   */
  getProjectBySlug(
    projectSlug: string,
    fetchOptions?: RequestInit
  ): Promise<Project> {
    let url = `/v1/project/slug` + projectSlug;

    return this._fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });
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
    query?: GetFormQuery,
    fetchOptions?: RequestInit
  ): Promise<Form> {
    let url = `/v1/form/id/${this.projectId}/${formSlug}`;
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    };

    if (query && query.revisionId) {
      (options as any).headers['X-Formik-Revision'] = query.revisionId;
    }

    return this._fetcher(url, options);
  }

  /**
   * Return a Form given its ID
   *
   * @param formSlug - form slug
   * @param query - Query parameters
   * @param fetchOptions - Additional request options
   * @returns A Formium Form entity
   *
   * @public
   */
  getFormById(
    id: string,
    query?: GetFormQuery,
    fetchOptions?: RequestInit
  ): Promise<Form> {
    let url = `/v1/form/${id}`;
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    };

    if (query && query.revisionId) {
      (options as any).headers['X-Formik-Revision'] = query.revisionId;
    }

    return this._fetcher(url, options);
  }

  /**
   * Submit data to Formium Form
   *
   * @param formSlug - Slug of the form
   * @param data - An object or FormData instance containing submission data.
   *
   * @public
   */
  submitForm(formSlug: string, data: SubmitData): Promise<void> {
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
    });
  }

  /**
   * Upload a file to Formium. All uploads are private by default.
   *
   * @param formSlug - Slug of the Form
   * @param file - File to be uploaded
   * @result URI of the uploaded file
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
export * from './types/User';
export * from './types/Project';
export * from './types/ProjectAccess';
export * from './types/ProviderIdentity';
export * from './types/CustomerAccess';
