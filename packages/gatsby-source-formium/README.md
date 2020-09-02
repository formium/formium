# gatsby-source-formium

[![Stable release](https://img.shields.io/npm/v/@formium/gatsby-source-formium.svg)](https://npm.im/@formium/gatsby-source-formium)

Source plugin for pulling forms into Gatsby from Formium projects. It outputs forms (and their schemas) so that they can be safely queried in Gatsby using GraphQL.

## Install

```sh
npm install --save gatsby-source-formium
```

## How to use

First, you need a way to pass environment variables to the build process, so secrets and other secured data aren’t committed to source control. We recommend using [`dotenv`](https://github.com/motdotla/dotenv) to expose environment variables safely. [Read more about dotenv and using environment variables here](https://gatsby.dev/env-vars). Then we can use these environment variables and configure our plugin.

Once installed, and once you have `dotenv` setup. Add the plugin to your `gatsby-config.js` file.

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-formium`,
      options: {
        // Get your projectId from https://dashboard.formium.io
        projectId: process.env.GATSBY_FORMIUM_PROJECTID,
        // Generate a personal access token by going to https://dashboard.formium.io/account#tokens and put it into a .env file (learn more about Gatsby environment variables here: https://gatsby.dev/env-vars).
        accessToken: process.env.FORMIUM_ACCESS_TOKEN,
      },
    },
  ],
};
```

## Plugin configuration options

### `projectId: string`

**Required**

Formium projectId

### `accessToken`

**Required**

Formium personal access token. You can generate a personal access token by going to https://dashboard.formium.io/account#tokens.

## How to query

You can query nodes created from Formium using GraphQL like the following:

**Note:** Learn to use the GraphQL tool and <kbd>Ctrl</kbd>+<kbd>Spacebar</kbd> at [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql) to discover the types and properties of your GraphQL model.

### Querying for all forms

To query for all forms in your project:

```graphql
{
  allFormiumForm {
    edges {
      node {
        id
        name
        slug
        projectId
        schema
        createAt
        updateAt
      }
    }
  }
}
```

You might do this in your `gatsby-node.js` using Gatsby's [createPages Node API](https://next.gatsbyjs.org/docs/node-apis/#createPages).

### Querying for a single form by id

To query for a **single** form with id of `5f2c1100a46ff8163a9b9f44`:

```graphql
{
  formiumForm(id: { eq: "5f2c1100a46ff8163a9b9f44" }) {
    id
    name
    slug
    projectId
    schema
    createAt
    updateAt
  }
}
```

You might query for a **single** form inside a component in your `src/components` folder, using [Gatsby's `StaticQuery` component](https://www.gatsbyjs.org/docs/static-query/).

### Querying for a single form by slug

To query for a **single** form with slug of `contact-me`:

```graphql
{
  formiumForm(slug: { eq: "contact-me" }) {
    id
    name
    slug
    projectId
    schema
    createAt
    updateAt
  }
}
```

You might query for a **single** form inside a component in your `src/components` folder, using [Gatsby's `StaticQuery` component](https://www.gatsbyjs.org/docs/static-query/).

## Create a page for every form in a project

Note: Every form in Formium has a slug. By default, your form's slug is the slugified title of your form. However, you can set a form's slug in the Formium dashboard in your form's Settings tab.

```js
// gatsby-node.js
const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Query all Forms
  const pages = await graphql(`
    {
      allFormiumForm {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)

  // The template for your form pages
  const template = path.resolve(__dirname, 'src/templates/form.js'),

  // Create pages for each Form in Prismic using the template.
  pages.data.allFormiumForm.edges.forEach(edge => {
    edge.nodes.forEach((node) => {
      createPage({
        path: `/forms/${node.slug}`,
        component: template,
        context: {
          id: node.id,
          slug: node.slug,
        },
      })
    })
  })
}
```

## Sourcing from multiple Formium projects

To source from multiple Formium projects, add another configuration for `gatsby-source-formium` in `gatsby-config.js`:

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-formium`,
      options: {
        projectId: process.env.GATSBY_FORMIUM_PROJECTID,
        accessToken: process.env.FORMIUM_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-source-formium`,
      options: {
        projectId: process.env.GATSBY_FORMIUM_SECOND_PROJECTID,
        accessToken: process.env.FORMIUM_ACCESS_TOKEN, // assuming you belong to both projects.
      },
    },
  ],
};
```

You'll also need to create a second Formium client.
