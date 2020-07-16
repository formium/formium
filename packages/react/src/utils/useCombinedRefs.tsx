/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';

type Refs = React.Ref<unknown> | React.MutableRefObject<unknown>;

export function useCombinedRefs(...refs: Array<Refs>) {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref: Refs) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<unknown>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
