/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import os from 'os';

export const ua = `@formium/cli ${__VERSION__} node-${
  process.version
} ${os.platform()} (${os.arch()})`;
