/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License  found in the
 * LICENSE file in the root directory of this source tree.
 */

const pkg = require('./package.json');
const replace = require('@rollup/plugin-replace');

module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      delete config.external;
      config.output.format = 'iife';
      config.moduleContext = {
        [require.resolve('cross-fetch')]: 'window',
      };
    }

    config.plugins.push(
      replace({
        __VERSION__: JSON.stringify(pkg.version),
      })
    );

    return config;
  },
};
