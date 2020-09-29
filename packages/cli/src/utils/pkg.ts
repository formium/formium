/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import fs from 'fs-extra';
import { PackageJson } from 'packages/cli/dist/types';
import { paths } from './env/paths';

let appPackageJson: PackageJson;
try {
  appPackageJson = fs.readJSONSync(paths.appPackageJson);
} catch (e) {}

export { appPackageJson };
