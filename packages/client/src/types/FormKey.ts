/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable @typescript-eslint/consistent-type-assertions */

/**
 * Form Key
 * @public
 */
export interface FormKey {
  /**
   * unique name of form key
   */
  name: string;

  /**
   * column visibility
   */
  visibility: FormKeyVisibility;
}

/**
 * Visibility enum
 * @public
 */
export enum FormKeyVisibility {
  HIDDEN = 'HIDDEN',
  SHOWN = 'SHOWN',
  ADMIN = 'ADMIN',
}
