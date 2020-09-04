import * as React from 'react';
import { FormiumForm, defaultComponents } from '@formium/react';
import { formium } from '../../lib/formium';

export default function FormPage(props) {
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState({});

  if (success) {
    return (
      <div>
        <h1>Thank you! Your response has been recorded.</h1>
        <br />
        {props.preview ? (
          <>
            <hr />
            <p>
              <small>
                Note: This was a test submission. It would have produced this
                data:
              </small>
            </p>
            <pre style={{ fontSize: 11 }}>{JSON.stringify(data, null, 2)}</pre>
            <button type="button" onClick={() => window.location.reload()}>
              Reset Form
            </button>
            <hr />
          </>
        ) : null}
      </div>
    );
  }
  return (
    <>
      <FormiumForm
        data={props.form}
        components={{
          ...defaultComponents,
          PageWrapper: ({ children }) => <>{children}</>,
          Header: ({ page }) => (
            <header>
              <h1 style={{ display: 'inline-flex', alignItems: 'center' }}>
                {page.title}
              </h1>
            </header>
          ),
        }}
        onSubmit={async values => {
          if (props.preview) {
            setData(values);
          } else {
            await client.submitForm(values);
          }
          setSuccess(true);
        }}
      />
    </>
  );
}

export const getStaticProps = async ({
  params,
  preview = false,
  previewData = {},
}) => {
  if (params?.slug) {
    try {
      const form = await formium.getFormBySlug(params.slug, previewData);
      console.log(form);
      return {
        props: {
          preview,
          form: form || null,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  return {
    props: {},
  };
};

export const getStaticPaths = async () => {
  // By default we only return 10 results, max is 100. Be aware of rate limits.
  const { data: forms, next } = await formium.findForms();
  console.log(forms);
  // Map forms to just slugs
  return {
    paths: forms.map(form => ({
      params: { slug: form.slug },
    })),
    fallback: false,
  };
};
