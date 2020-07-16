/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */
export type LogicResolver = (name: string) => any;

// taken initially from https://github.com/jlmessenger/json-conditions
const operations = {
  gte(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  greater than or equal:', a >= b);
    return a >= b;
  },
  lte(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  less than or equal:', a <= b);
    return a <= b;
  },
  lt(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  less than:', a < b);
    return a < b;
  },
  gt(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  greater than:', a > b);
    return a > b;
  },
  contains(fieldResolver: LogicResolver, [valueA, valueB]: string[]) {
    const a: string = evaluateLogic(fieldResolver, valueA as any);
    const b: string = evaluateLogic(fieldResolver, valueB as any);
    console.log('  contains:', a.includes(b));
    return a.includes(b);
  },
  ncontains(fieldResolver: LogicResolver, [valueA, valueB]: string[]) {
    const a: string = evaluateLogic(fieldResolver, valueA as any);
    const b: string = evaluateLogic(fieldResolver, valueB as any);
    console.log('  not contains:', !a.includes(b));
    return !a.includes(b);
  },
  startsWith(fieldResolver: LogicResolver, [valueA, valueB]: string[]) {
    const a: string = evaluateLogic(fieldResolver, valueA as any);
    const b: string = evaluateLogic(fieldResolver, valueB as any);

    console.log('  startsWith:', a.startsWith(b));
    return a.startsWith(b);
  },
  endsWith(fieldResolver: LogicResolver, [valueA, valueB]: string[]) {
    const a: string = evaluateLogic(fieldResolver, valueA as any);
    const b: string = evaluateLogic(fieldResolver, valueB as any);
    const result = a.endsWith(b);
    console.log('  endsWith:', result);
    return a.startsWith(b);
  },
  eq(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  equal:', a === b);
    console.log('a is an array', Array.isArray(a));
    // @todo confirm this is desired logic
    // When we have an array value for a field (e.g. checkboxes),
    // we alter evaluation to .includes so that the UI works as expected.
    if (Array.isArray(a)) {
      return a.includes(b);
    }
    return a === b;
  },
  ne(fieldResolver: LogicResolver, [valueA, valueB]: any[]) {
    const a = evaluateLogic(fieldResolver, valueA);
    const b = evaluateLogic(fieldResolver, valueB);
    console.log('  not equal:', a !== b);
    return a !== b;
  },
  and(fieldResolver: LogicResolver, conditions: any[]) {
    const foundFalse = conditions.some(
      condition => !evaluateLogic(fieldResolver, condition)
    );
    console.log('  and:', !foundFalse);
    return !foundFalse; // want all true
  },
  or(fieldResolver: LogicResolver, conditions: []) {
    const foundTrue = conditions.some(condition =>
      evaluateLogic(fieldResolver, condition)
    );
    console.log('  or:', foundTrue);
    return foundTrue; // want any item true
  },
  // not(fieldResolver: LogicResolver, condition: any[]) {
  //   const x = evaluateLogic(fieldResolver, condition);
  //   console.log('  not:', !x);
  //   return !x;
  // },
  value(_fieldResolver: LogicResolver, literal: any) {
    console.log('  value:', literal);
    return literal;
  },
  choice(fieldResolver: LogicResolver, fieldName: string) {
    const x = fieldResolver(fieldName);
    console.log(`  choice ${fieldName}:`, x);
    return x;
  },
  field(fieldResolver: LogicResolver, fieldName: string) {
    const x = fieldResolver(fieldName);
    console.log(`  field ${fieldName}:`, x);
    return x;
  },
};

export type OpsKeys = Extract<keyof typeof operations, string>;

export type LogicCondition = {
  op: OpsKeys;
  vars?: LogicCondition[];
  field?: string;
  value?: any;
  choice?: string;
};

export function evaluateLogic(
  fieldResolver: LogicResolver,
  conditionObject: LogicCondition
): any {
  const methodName = conditionObject.op;
  if (methodName) {
    const fn = operations[methodName];
    const args = conditionObject.vars || conditionObject.value;
    return fn(fieldResolver, args);
  } else {
    throw new Error('Unknown method name');
  }
}
