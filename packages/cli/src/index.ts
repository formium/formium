#!/usr/bin/env node
/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */
import sade from 'sade';
import glob from 'tiny-glob/sync';
import { paths } from './utils/env/paths';
import fs from 'fs-extra';
import chalk from 'chalk';
import { PackageJson } from './types';
import os from 'os';
import indexArray from 'just-index';
const pkg = require('../package.json');
import { Input, Select, MultiSelect } from 'enquirer';
import {
  createClient,
  FormiumClient,
  Project,
  ProjectAccessAccess,
  User,
} from '@formium/client';
import updateNotifier from 'update-notifier';
import AJV from 'ajv';
import { createOutput } from './utils/output/createOutput';
import { dir } from 'console';
import { FormiumBuildError } from './utils/errors';
import { renderLink } from './utils/output/link';
const prog = sade('formium');
const fetch = require('@zeit/fetch-retry')(require('node-fetch'));
const FORMIUM_DIR = '.formium';

updateNotifier({ pkg }).notify();

const output = createOutput();

async function getUser(
  forcedToken?: string
): Promise<{
  user: User;
  token: string;
  apiClient: FormiumClient;
}> {
  let maybeToken = forcedToken;
  if (!maybeToken) {
    try {
      const { token } = await fs.readJSON(paths.globalConfigFile);
      if (token) {
        maybeToken = token;
      } else {
        output.log(
          chalk.bold(
            chalk.blue(
              `Please create a personal access token in the dashboard and enter it in the terminal to get started.`
            )
          )
        );
        output.log(
          '👉 ' +
            chalk.underline(
              chalk.cyan(`https://dashboard.formium.io/account#tokens?ref=cli`)
            )
        );
        const prompt = new Input({
          message: `Personal Access Token`,
          result: (v: string) => v.trim(),
        });

        maybeToken = await prompt.run();
      }
    } catch (error) {
      output.log(
        chalk.bold(
          chalk.blue(
            `Please create a personal access token in the dashboard and enter it in the terminal to get started.`
          )
        )
      );
      output.log(
        '👉 ' +
          renderLink(`https://dashboard.formium.io/account#tokens?ref=cli`)
      );
      const prompt = new Input({
        message: `Personal Access Token`,
        result: (v: string) => v.trim(),
      });

      maybeToken = await prompt.run();
    }
  }

  try {
    const client = createClient('', {
      apiToken: maybeToken,
      fetchImplementation: fetch,
    });
    const maybeUser = await client.getMe();
    if (maybeUser && maybeToken) {
      await fs.ensureDir(paths.globalConfigDir);
      await fs.writeFile(
        paths.globalConfigFile,
        JSON.stringify({ token: maybeToken })
      );
      const apiClient = createClient('', {
        apiToken: maybeToken,
        fetchImplementation: fetch,
      });
      return { user: maybeUser, token: maybeToken, apiClient };
    } else {
      output.prettyError(
        new FormiumBuildError({
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        })
      );
      return getUser();
    }
  } catch (e) {
    output.prettyError(e);
    return getUser();
  }
}

async function getTokenAndUser(
  token?: string
): Promise<{
  user: User;
  token: string;
  apiClient: FormiumClient;
}> {
  let maybeToken = token;
  if (!maybeToken) {
    try {
      const { token } = await fs.readJSON(paths.globalConfigFile);
      maybeToken = token;
    } catch (error) {
      throw new Error(
        'No token found. Please run `formium login` or pass a token with --token=XXXX flag'
      );
    }
  }
  try {
    const apiClient = createClient('', {
      apiToken: maybeToken,
      fetchImplementation: fetch,
    });
    const maybeUser = await apiClient.getMe();
    return { user: maybeUser, apiClient, token: maybeToken! };
  } catch (error) {
    throw error;
  }
}

interface Options {
  /** Access token */
  token?: string;
  /** Project slug */
  project?: string;
}

prog
  .version(pkg.version)
  .option('--token, -t', 'Access Token')
  .option('--project, -p', 'Project slug')
  .command('login')
  .describe('Login to a Formium account')
  .example('login')
  .action(async () => {
    const { user } = await getUser();
    output.success(`Logged in. Hello ${user.name}!`);
  })
  .command('link')
  .action(async (opts: Options) => {
    let dirSpinner;
    try {
      const { apiClient } = await getUser(opts.token);
      const currentProject = await getCurrentProject(apiClient, opts.project);
      dirSpinner = output.spinner('Creating .formium directory...', 200);
      await fs.ensureDir(paths.appFormium);
      await fs.writeJSON(paths.appFormiumProjectJson, {
        projectId: currentProject.id,
        projectSlug: currentProject.slug,
        customerId: currentProject.customerId,
      });
      // update .gitignore
      let isGitIgnoreUpdated = false;
      try {
        const gitIgnore = await fs
          .readFile(paths.appGitIgnore, 'utf8')
          .catch(() => null);
        const EOL = gitIgnore && gitIgnore.includes('\r\n') ? '\r\n' : os.EOL;

        if (!gitIgnore || !gitIgnore.split(EOL).includes(FORMIUM_DIR)) {
          await fs.writeFile(
            paths.appGitIgnore,
            gitIgnore
              ? `${gitIgnore}${EOL}${FORMIUM_DIR}${EOL}`
              : `${FORMIUM_DIR}${EOL}`
          );
          isGitIgnoreUpdated = true;
        }
      } catch (error) {
        // ignore errors since this is non-critical
      }

      dirSpinner();
      output.success(
        `Linked to ${chalk.bold(currentProject.slug)} (created ${FORMIUM_DIR}${
          isGitIgnoreUpdated ? ' and added it to .gitignore' : ''
        })`
      );
    } catch (error) {
      if (dirSpinner) {
        dirSpinner();
      }
      output.prettyError(error);
    }
  })
  .command('logout')
  .describe('Logout of Formium')
  .action(async (opts: Options) => {
    let spinner;
    try {
      spinner = output.spinner('Logging out...', 200);
      const { apiClient } = await getTokenAndUser(opts.token);
      await apiClient.logout().catch(e => null);
      await fs.writeJSON(paths.globalConfigFile, {});
      await fs.emptyDir(paths.globalConfigDir);
      spinner();
      output.success('Logged out');
    } catch (error) {
      if (spinner) {
        spinner();
      }
      throw error;
    }
  })
  .command('forms pull')
  .describe('Pull latest forms from a project')
  .action(async (opts: Options) => {
    let spinner;
    try {
      const { apiClient, token } = await getTokenAndUser(opts.token);
      const currentProject = await getCurrentProject(apiClient, opts.project);
      const scopedApiClient = createClient(currentProject.id, {
        apiToken: token,
        fetchImplementation: fetch,
      });
      spinner = output.spinner('Finding forms');

      const forms = await output.time(
        'Finding forms',
        scopedApiClient.findForms({ limit: 100 })
      );
      await fs.writeJSON(paths.appFormiumDataJson, {
        data: {
          form: forms.data,
        },
        lastFetched: new Date(),
        cliVersion: __VERSION__,
      });
      spinner();
      output.success(`Successfully pulled ${forms.data.length} forms`);
    } catch (error) {
      console.log('error', error);
    }
  });

interface ProjectLink {
  projectId: string;
  customerId: string;
  projectSlug: string;
}

async function getCurrentProject(
  apiClient: FormiumClient,
  projectSlug?: string
) {
  if (projectSlug) {
    return await apiClient.getFormBySlug(projectSlug);
  }
  const maybeProjectConfig = await getProjectLinkFromDir();
  if (maybeProjectConfig) {
    return await apiClient.getProject(maybeProjectConfig.projectId);
  }
  let { data: projects } = await apiClient.getMyProjects();
  if (projects.length === 1) {
    return projects[0];
  }
  const projectBySlug = indexArray(projects, 'slug');
  const projectSelectPrompt = new Select({
    message: 'Choose a project',
    header: 'Link this to a Formium project',
    name: 'project',
    choices: projects.map(p => ({
      value: p.slug,
      message: `${p.name} (${p.slug})`,
    })),
  });
  const slug = await projectSelectPrompt.run();
  return projectBySlug[slug];
}

interface ProjectLink {
  projectId: string;
  customerId: string;
  projectSlug: string;
}

async function getProjectLinkFromDir(): Promise<ProjectLink | undefined> {
  const maybeProjectConfig = await fs.pathExists(paths.appFormiumProjectJson);
  if (maybeProjectConfig) {
    try {
      const projectConfig = await fs.readJSON(paths.appFormiumProjectJson);

      const linkSchema = {
        type: 'object',
        required: ['projectId', 'projectSlug', 'customerId'],
        properties: {
          projectId: {
            type: 'string',
            minLength: 1,
          },
          projectSlug: {
            type: 'string',
            minLength: 1,
          },
          customerId: {
            type: 'string',
            minLength: 1,
          },
        },
      };
      const ajv = new AJV();
      if (!ajv.validate(linkSchema, projectConfig)) {
        throw new Error(
          `Project Settings are invalid. To link your project again, remove the .formium directory.`
        );
      }
      return projectConfig;
    } catch (error) {
      // link file does not exists, project is not linked
      if (['ENOENT', 'ENOTDIR'].includes(error.code)) {
        return;
      }

      // link file can't be read
      if (error.name === 'SyntaxError') {
        throw new Error(
          `Project Settings could not be retrieved. To link your project again, remove the .formium directory.`
        );
      }

      throw error;
    }
  }
  return;
}

prog.parse(process.argv);
