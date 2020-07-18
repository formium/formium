# Slack Action

Slack is a platform for team communication. Adding a Slack action to your form will allow Formium to post a message for each form submission to the channel of your choice.

## Creating a Slack action

1. Navigate to the **Actions** tab of your form.

2. Click **Create Action** and select **Slack**.

   ![Action create button](/assets/actions/create-action-slack-button.png)

3. Enter an **Action Name** and **URL**.

   ![Action form](/assets/actions/slack-action-form.png)

4. Click **Create**.

## Custom options

You can configure additional settings in Formium that will override the default values you may have selected while creating the custom Incoming Webhook integration Slack. More information can be found in the [Slack documentation](https://api.slack.com/incoming-webhooks).

| Name             | Description                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Username**     | The username that should appear as the sender of the message in Slack. Defaults to "Formium" |
| **Icon URL**     | The URL of the icon/avatar of the sender. Defaults to the Formium logo.                      |
| **Channel Name** | The name of the channel to post to                                                           |

## What's the difference between the Slack action and the webhook action?

While you can use a Formium webhook action to send form data to Slack's Incoming Webhook integration, it will not be formatted very nicely. Formium leverages Slack's Webhook attachment API to pretty print submission data and include relevant links to your Formium dashboard.
