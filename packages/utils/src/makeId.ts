/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Joins strings to format IDs for compound components.
 *
 * @param args - Any number of arguments
 * @public
 */
export function makeId(...args: (string | number | null | undefined)[]) {
  return args.filter(val => val != null).join('--');
}
