/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';
import type { FormiumClient } from '@formium/client';

export const FormiumContext = React.createContext<FormiumClient>({} as any);

interface FormiumProviderProps {
  client: FormiumClient;
}

export const FormiumProvider: React.FC<FormiumProviderProps> = ({
  children,
  client,
}) => {
  return (
    <FormiumContext.Provider value={client}>{children}</FormiumContext.Provider>
  );
};

export const useFormiumClient = () => {
  return React.useContext(FormiumContext);
};

FormiumProvider.displayName = 'FormiumProvider';
