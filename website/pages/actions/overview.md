# Actions Overview

Formium actions allow you to automatically trigger tasks and processes in response to form submissions.

Common use cases of actions include posting your submission data to Slack, sending an email thank you note, triggering [Zapier](https://zapier.com) workflows, or saving submission data in an external system. Formium includes common actions out of the box while also allowing you to create custom webhook actions to suit your needs.

## Action variables

Each action has access to the following action variables, whether in a JSON payload or [mustache tag](https://mustache.github.io/mustache.5.html).

### `submit`

- `id`: The id of the stored submission.
- `data`: An object form submission data keyed by form field name.
- `ip`: The IP address the submission was receieved from.
- `createAt`: A timestamp of when the submission was receieved at.

### `values`

An alias for `submit.data` that's useful in email templates to quickly refer to a field value (e.g. `{{values.name}}`).

### `project`

- `id`: The id of the project the submission belongs to.
- `slug`: The slug of the project the submission belongs to.
- `name`: The name of the project the submission belongs to.

### `form`

- `id`: The id of the form the submit belongs to.
- `slug`: The slug of the form the submission belongs to.
- `name`: The name of the form the submission belongs to.

### `formium`

- `test`: Whether this action was triggered as a test.
- `webUrl`: The base URL of the Formium dashboard.
