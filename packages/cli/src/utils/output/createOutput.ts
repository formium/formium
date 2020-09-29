/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import chalk from 'chalk';
import boxen from 'boxen';
import { format } from 'util';
import { Console } from 'console';
import { renderLink } from './link';
import { wait } from './wait';

export type Output = ReturnType<typeof createOutput>;
export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

export function createOutput({ debug: debugEnabled = false } = {}) {
  function isDebugEnabled() {
    return debugEnabled;
  }

  function print(str: string) {
    process.stderr.write(str);
  }

  function log(str: string, color = chalk.grey) {
    print(`${color('>')} ${str}\n`);
  }

  function dim(str: string, color = chalk.grey) {
    print(`${color(`> ${str}`)}\n`);
  }

  function warn(
    str: string,
    slug: string | null = null,
    link: string | null = null,
    action: string | null = 'Learn More',
    options?: {
      boxen?: boxen.Options;
    }
  ) {
    const details = slug ? `https://err.sh/formium/${slug}` : link;

    print(
      boxen(
        chalk.bold.yellow('WARN! ') +
          str +
          (details ? `\n${action}: ${renderLink(details)}` : ''),
        {
          padding: {
            top: 0,
            bottom: 0,
            left: 1,
            right: 1,
          },
          borderColor: 'yellow',
          ...options?.boxen,
        }
      )
    );
    print('\n');
  }

  function note(str: string) {
    log(chalk`{yellow.bold NOTE:} ${str}`);
  }

  function error(
    str: string,
    slug?: string,
    link?: string,
    action = 'Learn More'
  ) {
    print(`${chalk.red(`Error!`)} ${str}\n`);
    const details = slug ? `https://err.sh/formium/${slug}` : link;
    if (details) {
      print(`${chalk.bold(action)}: ${renderLink(details)}\n`);
    }
  }

  function prettyError(err: Error & { link?: string; action?: string }) {
    return error(err.message, undefined, err.link, err.action);
  }

  function ready(str: string) {
    print(`${chalk.cyan('> Ready!')} ${str}\n`);
  }

  function success(str: string) {
    print(`${chalk.cyan('> Success!')} ${str}\n`);
  }

  function debug(str: string) {
    if (debugEnabled) {
      log(
        `${chalk.bold('[debug]')} ${chalk.gray(
          `[${new Date().toISOString()}]`
        )} ${str}`
      );
    }
  }

  function spinner(message: string, delay: number = 300) {
    if (debugEnabled) {
      debug(`Spinner invoked (${message}) with a ${delay}ms delay`);
      let isEnded = false;
      return () => {
        if (isEnded) return;
        isEnded = true;
        debug(`Spinner ended (${message})`);
      };
    }

    return wait(message, delay);
  }

  const c = {
    _times: new Map(),
    log(a: string, ...args: string[]) {
      debug(format(a, ...args));
    },
  };

  async function time<T extends (...args: any) => Unwrap<T>>(
    label: string,
    fn: Promise<Unwrap<T>> | (() => Promise<Unwrap<T>>)
  ): Promise<Unwrap<T>> {
    const promise = typeof fn === 'function' ? fn() : fn;
    if (debugEnabled) {
      c.log(label);
      Console.prototype.time.call(c, label);
      const r = await promise;
      Console.prototype.timeEnd.call(c, label);
      return r;
    }

    return promise;
  }

  return {
    isDebugEnabled,
    print,
    log,
    warn,
    error,
    prettyError,
    ready,
    success,
    debug,
    dim,
    time,
    note,
    spinner,
  };
}
