/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { resolveApp } from '../fs';
import path from 'path';
import XDGAppPaths from 'xdg-app-paths';

const globalConfig = XDGAppPaths('io.formium.cli');

export const paths = {
  appPackageJson: resolveApp('package.json'),
  appGitIgnore: resolveApp('.gitignore'),
  appRoot: resolveApp('.'),
  appFormium: resolveApp('.formium'),
  appFormiumForms: resolveApp('.formium/forms'),
  appFormiumProjectJson: resolveApp('.formium/project.json'),
  appFormiumReadMe: resolveApp('.formium/README.txt'),
  appFormiumDataJson: resolveApp('.formium/data.json'),
  progressEstimatorCache: resolveApp('node_modules/.cache/.progress-estimator'),
  //  /Users/jared/Library/Preferences/io.formium.cli/
  globalConfigDir: globalConfig.config(),
  // /Users/jared/Library/Preferences/io.formium.cli/config.json
  globalConfigFile: path.join(globalConfig.config(), 'config.json'),
};
