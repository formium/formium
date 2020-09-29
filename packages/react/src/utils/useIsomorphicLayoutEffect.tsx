/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
import * as React from 'react';
import { canUseDOM } from '@formium/utils';

// @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
export const useIsomorphicLayoutEffect = canUseDOM()
  ? React.useLayoutEffect
  : React.useEffect;
