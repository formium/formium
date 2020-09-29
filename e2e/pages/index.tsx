import * as React from 'react';
import { FormiumForm, defaultComponents } from '@formium/react';
const form = require('../formium/schemas/docs-feedback.json');

interface FormPageProps {
  preview: boolean;
}
let renderCounter = 0;
export default function FormPage({ preview = true }: FormPageProps) {
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState({});

  if (success) {
    return (
      <div>
        <h1>Thank you! Your response has been recorded.</h1>
        <br />
        {preview ? (
          <>
            <hr />
            <p>
              <small>
                Note: This was a test submission. It would have produced this
                data:
              </small>
            </p>
            <pre data-result style={{ fontSize: 11 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
            <button type="button" onClick={() => window.location.reload()}>
              Reset Form
            </button>
            <hr />
          </>
        ) : null}
        <div id="renderCounter">{renderCounter++}</div>
      </div>
    );
  }
  return (
    <>
      <FormiumForm
        data={form}
        components={defaultComponents}
        onSubmit={async values => {
          setData(values);
          setSuccess(true);
        }}
      />
      <div id="renderCounter">{renderCounter++}</div>
    </>
  );
}
