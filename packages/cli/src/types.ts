/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export interface PackageJson {
  name: string;
  source?: string;
  jest?: any;
  eslint?: any;
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
  };
}

export type AsyncReturnType<T> = T extends Promise<infer UnwrappedPromise>
  ? UnwrappedPromise
  : T extends (...args: any[]) => Promise<infer UnwrappedFunction>
  ? UnwrappedFunction
  : T;
