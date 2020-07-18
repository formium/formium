# Email Action

Email actions allow you to send almost any type of email communication whenever a submission is receieved by your form. You can compose custom HTML messages, use submission values in your email, and much more.

## Creating an email action

1. Navigate to the **Actions** tab of your form.

2. Click **Create Action** and select **Email**.

   ![Action create button](/assets/actions/create-action-email-button.png)

3. Enter an **Action Name** and **Email Addresses**.

   ![Email action form](/assets/actions/email-action-form.png)

4. Click **Create**.

## Custom email options

The email action also exposes several options to customize the email that is sent.

### Subject line

The subject line of the email that is sent. [Action variables](overview#action-variables) can be inlined using [mustache tags](https://mustache.github.io/mustache.5.html) such as `{{values.firstName}}`. If a custom subject line is not provided, the subject line defaults to:

```handlebars
[{{form.name}}] New submission receieved
```

### Content format

All emails are sent as HTML, but you can choose to compose yours in several different content formats.

#### Default template

Use the default Formium template. The template displays a summary of the submission values (`{{values}}`) and a link to view the submission in Formium.

#### Rich text

Compose your email using a rich text editor, similar to composing an email in Gmail, Outlook, and other email services.

#### Raw HTML

Compose your email using raw HTML. This format gives you complete freedom to style and structure your email however you want.

### From email address

The address that the email will be displayed as being sent from. Be careful that you are using this field correctly and not causing your email to be rejected as spam by protocols such as [DMARC](https://dmarc.org/overview/).

### From name

The name that the email will be displayed as being sent from.

### Reply-to email address

Where replies to the email will be addressed to.

## Custom mail server options

By default, emails will be sent from noreply@customer.formium-mail.com. Adding a custom mail server allows you to send emails from Gmail, Outlook, Mailgun, Mailchimp, and any other email service that supports SMTP requests.

- [How to Configure Gmail SMTP on Formium](../guides/connect-gmail-smtp)

### Host

The host address of the SMTP server. Gmail's SMTP host address is smtp.google.com, other email services will document their SMTP host address.

### Port

The port that the SMTP server accepts requests on. The available options are:

| Port    | Description                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| **25**  | Generally used as the unsecured port. If your SMTP server supports ports 465 or 587 you should use them instead. |
| **465** | Used for sending SMTP requests over SSL.                                                                         |
| **587** | Used for sending SMTP requests using TLS.                                                                        |

Gmail uses port 587, other mail services will document which port you should use.

### Security protocol

The security protocol that will be used when sending the SMTP request. The available options are:

| Protocol      | Description                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Unsecured** | The SMTP request will not be encryped. This option should be avoided and only used if your SMTP server does not support TLS or SSL. |
| **SSL**       | The SMTP request will be sent over SSL.                                                                                             |
| **TLS**       | The SMTP request will be sent using TLS.                                                                                            |

Gmail accepts SMTP requests using TLS, other mail services will document the security protocol you should use.

In general, SMTP requests should be sent to port **587** using **TLS** to ensure that your email is delivered securely. However, SMTP servers are not always within your control so Formium supports any combination of the above options.

### Username

The username of your SMTP server. For Gmail this would be the email address of your Google account.

### Password

The password of your SMTP server. Since this password needs to be decrypted and sent with each SMTP request, it is highly recommended you use an app password that is specific to Formium. See vendor specific instructions below.

- [Outlook.com](https://support.microsoft.com/en-us/help/12409/microsoft-account-app-passwords-and-two-step-verification)
- [Gmail](https://support.google.com/accounts/answer/185833?hl=en)

## Examples

- [Sending yourself a summary of each submission](../guides/sending-summary)

- [Sending a thank you note to each submitter](../guides/sending-thankyous)
