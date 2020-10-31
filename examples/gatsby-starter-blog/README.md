# Formium Gatsby Blog Starter

## 🚀 Quick start

1.  **Create a new Gatsby site using this template**

    Use the Gatsby CLI to create a new site, specifying the Formium blog starter.

    ```shell
    # Create a new Gatsby site using the Formium blog starter
    git clone https://github.com/formium/formium.git
    gatsby new my-blog-starter formium/examples/gatsby-starter-blog
    cd my-blog-starter/
    ```

1.  **Setup your credentials**

    Go to the Formium dashboard and generate a personal access token [https://dashboard.formium.io/account#tokens). Open `.env.sample` and replace `XXXXX` with your token's value.

    ```diff
    - FORMIUM_ACCESS_TOKEN=XXXXXXXX
    + FORMIUM_ACCESS_TOKEN=paste_your_access_token_here_do_not_wrap_with_quotes
    - FORMIUM_ACCESS_TOKEN=XXXXXXXX
    + GATSBY_FORMIUM_PROJECTID=paste_your_project_id_here
    ```

    Save and rename the file to just `.env`. This file is not committed to version control for security. Your personal access token is a password to your account. Treat it as such.

1.  **Start developing.**

    Start up Gatsby in development mode

    ```shell
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Open the `my-blog-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

    Every form in your Formium project has a dedicated page at `/f/:slug`. You can alter this behavior in `gatsby-node.js`.

    Some default Formium field components have been coded for you. You can customize them however you want to `src/components/formium.js`

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/formium/formium/examples/gatsby-starter-blog)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/formium/formium/examples/gatsby-starter-blog)
