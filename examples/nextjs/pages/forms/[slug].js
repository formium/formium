import * as React from 'react';
import { FormiumForm, defaultComponents } from '@formium/react';
import { createClient } from '@formium/client'
import fetch from 'isomorphic-unfetch';

const client = createClient(process.env.FORMIUM_PROJECT_ID, { apiKey: process.env.FORMIUM_TOKEN })

export default function FormPage(props) => {
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState({});
  
  if (success) {
    return (
      <div>
        <h1>
          Thank you! Your response has been recorded.
        </h1>
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
      <Head>
        <title>{props.form.title}</title>
      </Head>
      <FormiumForm    
        data={props.form}
        components={{
          ...defaultComponents,
          PageWrapper: ({ children }: any) => <>{children}</>,         
          Header: ({ page }: any) => (
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
            await client.submitForm(values)
          }
          setSuccess(true);
        }}
      />
      <style jsx global>{`
        body {
          max-width: 500px;
        }
        select,
        input,
        textarea {
          margin-top: 2px;
          font-size: 16px;
          font-family: var(--nc-font-sans);
          width: 100%;
          -webkit-appearance: none;
          -moz-appearance: none;
        }

        select::-moz-placeholder,
        select::-webkit-input-placeholder {
          color: var(--nc-ac-1);
        }
        [data-error='true'] {
          font-size: 14px;
          color: red;
        }

        select {
          -webkit-appearance: none;
          background: var(--nc-bg-2);
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline  points="6 9 12 15 18 9"></polyline></svg>');
          background-repeat: no-repeat;
          background-size: 1rem;
          background-position: center right 0.5rem;
        }

        @media (prefers-color-scheme: dark) {
          select {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline  points="6 9 12 15 18 9"></polyline></svg>');
          }
        }
      `}</style>
    </>
  );
};

export const getStaticProps = async ({ params, preview = false, previewData = {} }) => {
  if (params?.formId) {
    try {
      const form = await client.getFormBySlug(params.slug, previewData);
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
  const { data: forms, next } = await client.findForms()
  // Map forms to just slugs
  return forms.map((post) => ({
    params: { slug: form.slug },
  }))
}