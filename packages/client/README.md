# `@formium/client`

The is the **browser** and **node** SDK for Formium, a new form storage and processing service. In a browser, this package allows you to send form submissions and upload files to your Formium Forms through the Formium REST API. In Node.js, you will be able to access your forms and their schemas.

This reference documents every object and method available in Formium's browser-side JavaScript library.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Prerequisites](#prerequisites)
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [`createClient(projectId: string, options?: Options)`](#createclientprojectid-string-options-options)
  - [The Formium Client](#the-formium-client)
    - [`formium.submitForm(formSlug: string, data: Record<string, any> | FormData)`](#formiumsubmitformformslug-string-data-recordstring-any--formdata)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Prerequisites

This package requires an active [Formium](https://formium.io) account, project, and a form. You can sign up for free at https://dashboard.formium.io/signup. Free accounts allow for 100 monthly submissions, 10 active forms, and 100MB of total file storage.

## Introduction

Formium is a new service that helps you easily store form submissions and trigger automated no-code workflows without writing any backend code. You can send thank you emails, Slack notifications, webhooks and more whenever you receive a new submission. This package allows you to directly send data to the Formium Forms API. It is completely framework agnostic and has zero dependencies.

> Note: that JavaScript is not required to use Formium Forms, you can always send form submissions with just plain HTML.

## Installation

You can install Formium with [NPM](https://npmjs.com),
[Yarn](https://yarnpkg.com), or a good ol' `<script>` via
[unpkg.com](https://unpkg.com).

### NPM

```sh
npm install @formium/client --save
```

or

```
yarn add @formium/client
```

### CDN

If you're not using a module bundler or package manager we also have a global ("UMD") build hosted on the [unpkg.com](https://unpkg.com) CDN. Simply add the following `<script>` tag to the bottom of your HTML file:

```html
<script src="https://unpkg.com/@formium/client/dist/client.umd.production.min.js"></script>
```

Once you've added this you will have access to the `window.formiumClient.<Insert_Function_Name_Here>` variables.

## Usage

```js
import { createClient } from "@formium/client";

const client = createClient("YOUR_PROJECT_ID");

client.submitForm("YOUR_FORM_SLUG", { hello: "world" });
```
