/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { FormKey } from './FormKey';
import { FormSchema } from './FormSchema';
/* eslint-disable @typescript-eslint/consistent-type-assertions */

/**
 * Form
 *
 * @public
 */
export interface Form {
  /**
   * unique id of form
   */
  id: string;

  /**
   * customer that the form belongs to
   */
  customerId: string;

  /**
   * project that the form belongs to
   */
  projectId: string;

  /**
   * project-unique name of the form
   */
  name: string;

  /**
   * preview url of the form
   */
  previewUrl: string;

  /**
   * schema of the form
   */
  schema?: FormSchema;

  /**
   * project-unique slug of the form
   */
  slug: string;

  /**
   * keys that are allowed in the form submission
   */
  keys: Array<FormKey>;

  /**
   * keys that are allowed in the form submission
   */
  submitLayout: FormSubmitLayout;

  /**
   * types of uploads that are allowed (can be null if no uploads allowed)
   */
  uploadTypes?: Array<FormUploadTypes>;

  /**
   * status
   */
  status: FormStatus;

  /**
   * validation settings
   */
  validate: FormValidate;

  /**
   * list of actions that are sent to on submission
   */
  actionIds: Array<string>;

  /**
   * URL to redirect to on a successful form post
   */
  redirectUrl?: string;

  /**
   * total number of submits received
   */
  submitCount: number;

  /**
   * created timestamp
   */
  createAt: string;

  /**
   * created by user id
   */
  createId: string;

  /**
   * updated timestamp
   */
  updateAt: string;

  /**
   * updated by user id
   */
  updateId: string;

  /**
   * deleted timestamp
   */
  deleteAt?: string;

  /**
   * deleted by user id
   */
  deleteId?: string;
}

/**
 * Submission UI layout
 *
 * @public
 */
export enum FormSubmitLayout {
  LIST = 'LIST',
  TABLE = 'TABLE',
}

/**
 * Accepted upload types
 *
 * @public
 */
export enum FormUploadTypes {
  JPG = 'JPG',
  GIF = 'GIF',
  PNG = 'PNG',
  PDF = 'PDF',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  PPT = 'PPT',
  PPTX = 'PPTX',
}

/**
 * Form status
 * @deprecated ununsed
 * @public
 */
export enum FormStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Form key validation strategy
 * @public
 */
export enum FormValidate {
  ANY = 'ANY',
  KEYS_ANY = 'KEYS_ANY',
  KEYS_ALL = 'KEYS_ALL',
}
