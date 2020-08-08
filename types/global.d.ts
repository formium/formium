// Declare global variables for TypeScript and VSCode.
// Do not rename this file or move these types into index.d.ts
// @see https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking
declare const __DEV__: boolean;
declare const __VERSION__: string;
declare const $FixMe: any;
declare module 'asyncro'; // doesn't have types (unmerged 2+ year old PR: https://github.com/developit/asyncro/pull/10)
declare module 'enquirer'; // doesn't have types for Input or Select
declare module 'tiny-glob/sync'; // /sync isn't typed (but maybe we can use async?)
declare module 'just-index'; // /sync isn't typed (but maybe we can use async?)
declare module 'update-notifier';

declare type AsyncReturnType<T> = T extends Promise<infer UnwrappedPromise>
  ? UnwrappedPromise
  : T extends (...args: any[]) => Promise<infer UnwrappedFunction>
  ? UnwrappedFunction
  : T;
