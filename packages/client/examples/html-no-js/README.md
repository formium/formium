# Formium HTML-only examples

You can use Formium Forms without any JavaScript. To do this, set the `action` attribute of a HTML `form` element to your Form's endpoint and be sure to add unique `id` attributes to all `input`, `textarea`, and `select` elements in your form.

```html
<form
  action="https://api.formium.io/submit/{YOUR_PROJECT_ID}/{YOUR_FORM_SLUG}"
  method="POST"
>
  <p>
    <label for="email">Email Address: </label>
    <input type="email" id="email" name="email" placeholder="Email address" />
  </p>
  <button type="submit">Send</button>
</form>
```

> Formium provides a nice "Thank You" page by default. However, you can set a custom redirect URL in your Formium Dashboard by going to your form's Settings tab.

## Limitations

While HTML is great for basic forms here and there. Be aware of these limitations:

- File uploads are not supported via plain HTML
- `<select multiple>` selected values will be stored/sent as a comma-delimited string (and not as an array like they are in the js client)
- Validation is only possible handled entirely by with HTML attributes
