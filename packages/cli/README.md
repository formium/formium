# @formium/cli

[![Stable release](https://img.shields.io/npm/v/@formium/cli.svg)](https://npm.im/@formium/cli)

This is an **experimental** command line interface for Formium. It is not yet ready for production usage, yet. Its goal is to streamline development and deployment of sites using React frameworks _without_ static build steps / data fetching baked-in (i.e. you are not using Gatsby or Next.js).

## Prerequisites

This package requires an active [Formium](https://formium.io) account, project, and a form. You can sign up for free at https://dashboard.formium.io/signup. Free accounts allow for 100 monthly submissions, 10 active forms, and 100MB of total file storage.

## Installation

### On your local machine

On your local machine, you'll want to install the CLI globally.

```shell
npm i -g @formium/cli
```

Next, you'll want to login. This will prompt you to generate a personal access token for the CLI. You can do this in your Formium account settings: https://dashboard.formium.io/account#tokens.

```shell
formium login
```

### CI/CD/Non-interactive

If you want to use the CLI in a non-interactive shell such as a Continuous Integration / Delivery service (e.g. CircleCI, GitHub Actions, Jenkins, etc.). You should generate an access token and store it as a secure environment variable. You can then pass the token to any command below by appending `--token=XXXX` where `XXX` will be the name of the environment variable you created.

## Usage

### `formium login`

Login to your Formium account. This requires creating a personal access token to your account (https://dashboard.formium.io/account#tokens).

### `formium logout`

Log out of your account. This will _permanently_ destroy your access token. You will need to use new one in the future.

### `formium link`

Link a folder to a Formium project. This command will create `.formium` folder in the directory in which you run it in, generate Formium configuration files there, and add the entire folder to your `.gitignore` file. The contents of the `.formium` folder may change at anytime going forward.

### `formium forms pull`

Downloads all forms (just their schemas, not submissions) into `.formium` directory as JSON. This command is a work-in-progress. In the future, the goal is to couple this with client-side runtime helpers to access the data (kind of like Amplify does) in a way that is friendlier and ideally tree shakeable.

## Reference

```shell
Usage
    $ formium <command> [options]

  Available Commands
    login         Login to a Formium account
    link          Link a directory to a Formium project
    logout        Logout of Formium
    forms pull    Pull latest forms from a project

  For more info, run any command with the `--help` flag
    $ formium login --help
    $ formium link --help

  Options
    -t, --token      Access Token
    -p, --project    Project slug
    -v, --version    Displays current version
    -h, --help       Displays this message

```
