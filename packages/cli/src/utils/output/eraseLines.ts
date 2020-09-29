/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ansiEscapes from 'ansi-escapes';

export function eraseLines(numberOfLines: number) {
  return ansiEscapes.eraseLines(numberOfLines);
}
