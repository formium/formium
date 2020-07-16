/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { useFormikContext, getIn, FormikTouched, FormikValues } from 'formik';
import {
  FormElementActionAction,
  FormElementAction,
  FormElementActionDetailsToType,
  Form,
  FormSchema,
  FormElement,
  FormElementType,
} from '@formium/client';
import { evaluateLogic, LogicCondition } from '@formium/eval';

export interface FormiumLogicProps {
  element: FormElement;
}

const makeResolver = (values: any) => (path: any) => {
  return getIn(values, path);
};

const shouldExecuteAction = (
  valuesMap: Record<string, unknown>,
  touched: FormikTouched<any>,
  element: FormElement,
  condition: FormElementAction['condition']
) => {
  if (
    element.type === FormElementType.RADIO ||
    element.type === FormElementType.CHECKBOX
  ) {
    return evaluateLogic(makeResolver(valuesMap), condition as LogicCondition);
  } else if (getIn(touched, element.slug)) {
    return evaluateLogic(makeResolver(valuesMap), condition as LogicCondition);
  }
  return false;
};

export function getChoiceMap(fields: FormSchema['fields']) {
  let items: Record<string, string> = {};
  Object.values(fields)
    .filter(i => i.type === FormElementType.CHOICE)
    .reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as Record<string, unknown>);
  return items;
}
function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
export const unstable_FormiumLogic = React.memo<{
  form: Form;
  element: FormElement;
  setFieldProperty: (name: string, partial: Partial<FormElement>) => void;
}>(({ form, element, setFieldProperty }) => {
  const { values, touched } = useFormikContext<FormikValues>();
  const { schema: { fields } = {} } = form;

  const valuesMap = React.useMemo<Record<string, unknown>>(
    () =>
      Object.values(fields || {}).reduce((prev, curr) => {
        if (curr.type === FormElementType.CHOICE) {
          prev[curr.slug] = curr.title;
        } else if (
          curr.type !== FormElementType.PAGE &&
          curr.type !== FormElementType.GROUP
        ) {
          prev[curr.id] = values[curr.slug];
        }
        return prev as Record<string, unknown>;
      }, {} as any),
    [values]
  );

  const previous = usePrevious(valuesMap);
  React.useEffect(() => {
    if (
      element.actions &&
      element.actions.length > 0 &&
      element.actions.forEach &&
      ((previous && valuesMap !== previous) || !previous)
    ) {
      element.actions.forEach((item: FormElementAction) => {
        // Field-level actions
        if (item.details.to.type === FormElementActionDetailsToType.FIELD) {
          // hide
          if (item.action === FormElementActionAction.HIDE) {
            setFieldProperty(item.details.to.value, {
              hidden: shouldExecuteAction(
                valuesMap,
                touched,
                element,
                item.condition
              )
                ? true
                : false,
            });
          }

          // show
          if (item.action === FormElementActionAction.SHOW) {
            setFieldProperty(item.details.to.value, {
              hidden: shouldExecuteAction(
                valuesMap,
                touched,
                element,
                item.condition
              )
                ? false
                : true,
            });
          }
        }
      });
    }
  }, [valuesMap, setFieldProperty, previous]);
  return null;
});

unstable_FormiumLogic.displayName = 'FormiumLogic';
