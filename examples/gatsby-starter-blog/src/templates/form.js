import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { FormiumForm, defaultComponents } from "@formium/react"
import formium from "../lib/formium"

const TextInput = props => (
  <input style={{ border: "1px red #ddd" }} {...props} />
)
const formiumComponents = {
  ...defaultComponents,
  TextInput,
}
const BlogPostTemplate = ({ data, pageContext, location }) => {
  const formiumFormData = data.formiumForm
  const siteTitle = data.site.siteMetadata.title
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={formiumFormData.name} />
      <FormiumForm
        data={formiumFormData}
        components={formiumComponents}
        onSubmit={async values => {
          await formium.submitForm(values)
          alert("Success!")
        }}
      />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <footer>
        <Bio />
      </footer>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query FormiumFormBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    formiumForm(slug: { eq: $slug }) {
      id
      name
      slug
      projectId
      schema
      createAt
      updateAt
    }
  }
`
