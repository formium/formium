/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */
import { useEffect, useState } from 'react';
import { canUseDOM } from '@formium/utils';

type parserOptions<T> =
  | {
      raw: true;
    }
  | {
      raw: false;
      serializer: (value: T) => string;
      deserializer: (value: string) => T;
    };

export const useStorage = <T,>(
  key: string,
  initialValue?: T,
  options?: parserOptions<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  if (!canUseDOM) {
    return [initialValue as T, () => {}];
  }

  // Use provided serializer/deserializer or the default ones
  const serializer = options
    ? options.raw
      ? String
      : options.serializer
    : JSON.stringify;
  const deserializer = options
    ? options.raw
      ? String
      : options.deserializer
    : JSON.parse;

  const [state, setState] = useState<T>(() => {
    try {
      const sessionStorageValue = sessionStorage.getItem(key);
      if (sessionStorageValue !== null) {
        return deserializer(sessionStorageValue);
      } else {
        initialValue && sessionStorage.setItem(key, serializer(initialValue));
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, serializer(state));
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. Also JSON.stringify can throw.
    }
  }, [state]);

  return [state, setState];
};
