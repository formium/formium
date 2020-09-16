/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { FormKey } from './FormKey';
import { FormSchema } from './FormSchema';
/* eslint-disable @typescript-eslint/consistent-type-assertions */

/**
 * An interface for a Formium Form.
 *
 * @public
 */
export interface Form {
  /**
   * unique id of formzzzxcvxzcv
   */
  id: string;

  /**
   * The Customer that the form belongs to
   */
  customerId: string;

  /**
   * The Project that the form belongs to
   */
  projectId: string;

  /**
   * The Project-unique name of the form
   */
  name: string;

  /**
   * The Preview URL of the form. Used by the the dashboard
   */
  previewUrl: string;

  /**
   * The schema of the Form
   */
  schema?: FormSchema;

  /**
   * The Project-unique slug of the form
   */
  slug: string;

  /**
   * The set of keys that are allowed in the form submission
   */
  keys: Array<FormKey>;

  /**
   * The form submission layout in the dashboard.
   */
  submitLayout: FormSubmitLayout;

  /**
   * The types of uploads that are allowed (can be null if no uploads allowed)
   */
  uploadTypes?: Array<FormUploadTypes>;

  /**
   * The form's status
   * @deprecated
   */
  status: FormStatus;

  /**
   * Form validation settings.
   * @deprecated
   */
  validate: FormValidate;

  /**
   * The list of workflows that are sent to on submission
   */
  actionIds: Array<string>;

  /**
   * URL to redirect to on a successful form post
   * @deprecated
   */
  redirectUrl?: string;

  /**
   * The total number of submissions received
   * 
   */
  submitCount: number;

  /**
   * The created timestamp
   */
  createAt: string;

  /**
   * The created by user id
   */
  createId: string;

  /**
   * The updated timestamp
   */
  updateAt: string;

  /**
   * The updated by user id
   */
  updateId: string;

  /**
   * The deleted timestamp
   */
  deleteAt?: string;

  /**
   * The deleted by user id
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
  /**
   * Allow any keys including unknown or new keys
   */
  ANY = 'ANY',
  /**
   * Allow any _existing_ keys, but reject any new ones
   */
  KEYS_ANY = 'KEYS_ANY',
  /**
   * Only allows new submissions with _all_ keys
   */
  KEYS_ALL = 'KEYS_ALL',
}
