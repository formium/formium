import * as React from 'react'
import { FormiumForm, defaultComponents } from '@formium/react'
import { formium } from '../../lib/formium'
import { Form } from '@formium/client'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'

interface FormPageProps {
  form: Form
  preview: boolean
}

export default function FormPage(props: FormPageProps) {
  const [success, setSuccess] = React.useState(false)
  const [data, setData] = React.useState({})
  const router = useRouter()

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
    )
  }
  return (
    <>
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
        onSubmit={async (values) => {
          if (props.preview) {
            setData(values)
          } else {
            await formium.submitForm(router.query.slug as string, values)
          }
          setSuccess(true)
        }}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  FormPageProps,
  { slug: string }
> = async ({ params, preview = false, previewData = {} }) => {
  const form = await formium.getFormBySlug(params!.slug, previewData)
  return {
    props: {
      preview,
      form,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: forms } = await formium.findForms()
  return {
    paths: forms.map((form) => ({
      params: { slug: form.slug },
    })),
    fallback: false,
  }
}
