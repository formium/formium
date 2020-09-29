/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const fs = require('fs-extra');

// TSDX removes the shebang, so we need to add it manually in order
// to make the file executable
fs.writeFileSync(
  './dist/index.js',
  '#!/usr/bin/env node\n' +
    `'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cli.cjs.production.min.js')
} else {
  module.exports = require('./cli.cjs.development.js')
}`
);
