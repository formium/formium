import os from 'os';

export const ua = `@formium/cli ${__VERSION__} node-${
  process.version
} ${os.platform()} (${os.arch()})`;
