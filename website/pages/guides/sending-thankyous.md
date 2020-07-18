# How to Send a Thank You Note to Submitters

This guide will assist you with setting up automated thank you notes to submitters.

## Step 1: Form Setup

In order to send a thank you note to the person who filled out your form, make sure that you have a form field that asks for their email.

## Step 2: Create and Customize and Email Action

Create an email action and use the field value of the email in your email action's **Email Addresses**.

- For example, if you have a `workAddress` form field, you can send an email to that addresses by adding `{{values.workAddress}}` under **Email Addresses**.
- You can also receive a copy of each thank you note by adding your own email address.

Customize the email by setting the **Content Format** to **Rich Text** composing a thank you message:

```handlebars
Hi {{values.name}},

Thanks for reaching out to me!

I usually respond to messages within 24 hours so expect a reply from me soon.

Best,
Jane
```

You can also select **Raw HTML** as a Content Format.

## Step 3: Test your action

Save the action, and send a test email to yourself. All set!
