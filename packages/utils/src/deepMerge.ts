/**
 * @private
 * @param {Record<string,any>} opts
 * @param {Record<string,any>} [overrides]
 * @param {boolean} [lowerCase]
 * @returns {Partial<opts>}
 */
export function deepMerge(opts: any, overrides: any, lowerCase?: boolean) {
  let out: any = {},
    i;
  if (Array.isArray(opts)) {
    return opts.concat(overrides);
  }
  for (i in opts) {
    const key = lowerCase ? i.toLowerCase() : i;
    out[key] = opts[i];
  }
  for (i in overrides) {
    const key = lowerCase ? i.toLowerCase() : i;
    const value = /** @type {any} */ overrides[i];
    out[key] =
      key in out && typeof value == 'object'
        ? deepMerge(out[key], value, key === 'headers')
        : value;
  }
  return out;
}
