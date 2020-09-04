/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Return a slugified copy of a string.
 *
 * @param str - The string to be slugified
 * @public
 */
export function toSlug(str: string): string {
  let s = str;
  if (!s) {
    return '';
  }
  s = s.toLowerCase().trim();
  s = s.replace(/ & /g, ' and ');
  s = s.replace(/[ ]+/g, '-');
  s = s.replace(/[-]+/g, '-');
  s = s.replace(/[^a-z0-9-]+/g, '');
  s = s.length > 32 ? s.substr(0, 32) : s;
  return s;
}
