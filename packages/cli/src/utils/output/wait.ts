/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import ora from 'ora';
import chalk from 'chalk';
import { eraseLines } from './eraseLines';

export function wait(msg: string, delay: number = 300, _ora = ora) {
  let spinner: ReturnType<typeof _ora>;
  let running = false;

  const planned = setTimeout(() => {
    spinner = _ora(chalk.gray(msg));
    spinner.color = 'gray';
    spinner.start();
    running = true;
  }, delay);

  const cancel = () => {
    clearTimeout(planned);
    if (running) {
      spinner.stop();
      process.stderr.write(eraseLines(1));
      running = false;
    }
    process.removeListener('formiumExit', cancel);
  };

  // @ts-ignore
  process.on('formiumExit', cancel);
  return cancel;
}
