import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import formium from "../lib/formium"

// You can place a specific Formium form anywhere in your application.
// However, in order for Gatsby to statically analyze it, you cannot use
// a graphql query variable for the form's slug or id. You
const ASpecificFormiumForm = props => {
  const [success, setSucess] = React.useState(false)
  const data = useStaticQuery(graphql`
    {
      formiumForm(slug: { eq: "hello" }) {
        id
        createAt
        name
        projectId
        schema
        slug
        updateAt
        version
      }
    }
  `)
  if (success) {
    return <h1>Thanks! Submission successful</h1>
  }
  return (
    <FormiumForm
      form={data.formiumForm}
      components={{ ...defaultComponents }}
      onSubmit={async values => {
        // Send the form data to Formium Storage
        await formium.submitForm(values)
        setSucess(true)
      }}
    />
  )
}

export default ASpecificFormiumForm
