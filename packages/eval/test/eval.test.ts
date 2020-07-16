/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License  found in the
 * LICENSE file in the root directory of this source tree.
 */

import { evaluateLogic, LogicCondition } from '@formium/eval';

const andTrue: LogicCondition = {
  op: 'and',
  vars: [
    {
      op: 'eq',
      vars: [
        { op: 'field', value: 'someStringValue' },
        { op: 'field', value: 'sameStringValue' },
      ],
    },
    {
      op: 'startsWith',
      vars: [
        { op: 'field', value: 'someStringValue' },
        { op: 'value', value: 'liter' },
      ],
    },
    {
      op: 'eq',
      vars: [
        { op: 'field', value: 'someBooleanValue' },
        { op: 'value', value: true },
      ],
    },
  ],
};

const orAndNotTrue: LogicCondition = {
  op: 'or',
  vars: [
    {
      op: 'and',
      vars: [
        {
          op: 'eq',
          vars: [
            { op: 'field', value: 'fieldTrue' },
            { op: 'value', value: false },
          ],
        },
        {
          op: 'eq',
          vars: [
            { op: 'field', value: 'fieldTrue' },
            { op: 'value', value: false },
          ],
        },
      ],
    },
    {
      op: 'ne',
      vars: [
        { op: 'field', value: 'fieldTrue' },
        { op: 'value', value: false },
      ],
    },
  ],
};

const andOrNotTrue: LogicCondition = {
  op: 'and',
  vars: [
    {
      op: 'or',
      vars: [
        {
          op: 'eq',
          vars: [
            { op: 'field', value: 'fieldTrue' },
            { op: 'value', value: false },
          ],
        },
        {
          op: 'eq',
          vars: [
            { op: 'field', value: 'fieldTrue' },
            { op: 'value', value: true },
          ],
        },
      ],
    },
    {
      op: 'ne',
      vars: [
        { op: 'field', value: 'fieldTrue' },
        { op: 'value', value: false },
      ],
    },
  ],
};

const fieldData = {
  someStringValue: 'literal',
  sameStringValue: 'literal',
  someBooleanValue: true,
  oneVariable: 'hello',
  anotherVariable: 'goodbye',
  fieldTrue: true,
  fieldFalse: true,
};

function resolveField(path: any) {
  if (fieldData.hasOwnProperty(path)) {
    return (fieldData as any)[path];
  }
  throw new Error(`Unknown op: 'field', value: ${path}`);
}

describe('@formium/eval', () => {
  describe('evaluate logic', () => {
    it('works', () => {
      expect(evaluateLogic(resolveField, andTrue)).toEqual(true);
    });
    it('andOrNotTrue', () => {
      expect(evaluateLogic(resolveField, andOrNotTrue)).toEqual(true);
    });
    it('orAndNotTrue', () => {
      expect(evaluateLogic(resolveField, orAndNotTrue)).toEqual(true);
    });
  });
});
