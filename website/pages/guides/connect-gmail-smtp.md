# How to Configure Gmail SMTP on Formium

This guide will assist you with connecting your action to the Gmail SMTP Server, allowing you to send emails through your gmail.com address.

## Step 1: Create an App Password with Google

Follow Google's steps to [create an App Password](https://support.google.com/mail/answer/185833). App Passwords are used to grant applications access to your account without the risk of exposing your actual password. Treat them securely.

Though we strongly reccommend using an App Password, you can authenticate with Gmail using your plain text password. Please consider this as a last resort option.

## Step 2: Create a Mail Server in Formium

In your Email Action, expand the Custom Mail Server Options section. Click on Create New to open the Create Mail Server modal.

1. Name your Mail Server, for example Secure Gmail SMTP
2. Select Gmail as the Provider
3. For username, enter your gmail account, for example `securesally@gmail.com`
4. Enter the App Password you generated in Step 1. It should look something like `vpxz yxez rdbn fvjf`

## Step 3: Test your action

That's it! Save your Email Action and send a test email to yourself.
