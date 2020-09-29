
# Contributing to Formium
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

  - [Code of Conduct](#code-of-conduct)
  - [Ways to Contribute](#ways-to-contribute)
  - [Working on your first Pull Request?](#working-on-your-first-pull-request)
  - [Sending a Pull Request](#sending-a-pull-request)
  - [Working locally](#working-locally)
    - [Develop](#develop)
    - [Test](#test)
    - [How to increase the chance of a change being accepted?](#how-to-increase-the-chance-of-a-change-being-accepted)
  - [How does documentation work?](#how-does-documentation-work)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Code of Conduct

Formium has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct, and we expect project participants to adhere to it.
Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Ways to Contribute

There are many ways to contribute to Formium, code contribution is one aspect of it.

- **Spread the word** - Evangelize Formium by linking to Formium.io on your website, every backlink matters. Follow us on [Twitter](https://twitter.com/formiumhq), like and retweet the important news. Or just talk about us with your friends.
- **Give us feedback.** Tell us what we're doing well or where we can improve. Please upvote (👍) the issues that you are the most interested in seeing solved.
- **Help new users.** You can answer questions on StackOverflow or GitHub Discussions
- **Make changes happen.** Suggest changes to the documentation or code.
- **Write Guides** If you come with a cool workflow, write about and we'll feature it in the blog or as an [official guide](https://formium.io/guides)
- **Report bugs** or missing features by creating an issue.
- **Review and comment** on existing pull requests and issues.
- **Collaborate or partner with us** Our team is open to formal collaboration and partnerships. Send an email to [hello@formium.io](mailto:hello@formium.io) to reach out.

## Working on your first Pull Request?

You can learn how from this free video series:

[How to Contribute to a Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/formium/formium/issues?q=is:open+is:issue+label:"good+first+issue") that contain changes that have a relatively limited scope. This label means that there is already a working solution to the issue in the discussion section. Therefore, it is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you have started to work on it so other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than a week, it's fine to take it over but you should still leave a comment.
If there has been no activity on the issue for 7 to 14 days, it is safe to assume that nobody is working on it.

## Sending a Pull Request

Formium is a community project, so [Pull Requests](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) are always welcome, but, before working on a large change, it is best to open an issue first to discuss it with the maintainers.

When in doubt, keep your Pull Requests small. To give a Pull Request the best chance of getting accepted, don't bundle more than one feature or bug fix per Pull Request. It's often best to create two smaller Pull Requests than one big one.

1. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/formium.git
cd formium
git remote add upstream https://github.com/formium/formium.git
```

3. Synchronize your local `next` branch with the upstream one:

```sh
git checkout master
git pull upstream master
```

4. Install the dependencies with [yarn](https://yarnpkg.com) (npm isn't supported):

```sh
yarn install
```

5. Create a new topic branch:

```sh
git checkout -b my-topic-branch
```

6. Make changes, commit and push to your fork:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/formium/formium) and [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

The core team is monitoring for Pull Requests. We will review your Pull Request and either merge it, request changes to it, or close it with an explanation.

## Working locally

The repo is managed with Lerna, Yarn Workspaces, and TSDX. 

### Develop

```shell
yarn install
yarn dev
```

### Test

Runs jest on all projects

```
yarn test
```

## How to increase the chance of a change being accepted?

The continuous integration service runs a series of checks automatically when a Pull Request is opened. We also run an integration test against formium.io. If you're not
sure if your changes will pass, you can always open a Pull Request and the GitHub UI will display a summary of
the results. If any of them fail, refer to [Checks and how to fix them](#checks-and-how-to-fix-them).

Make sure the following is true:

- The branch is targeted at `master` for ongoing development. We do our best to keep `master` in good shape, with all tests passing. Code that lands in `master` must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of `master` at any time.
- If a feature is being added:
  - If the result was already achievable with the library, explain why this feature needs to be added.
  - If this is a common use case, consider adding an example to the documentation.
- When adding new features or modifying existing, please include tests to confirm the new behavior.
- The branch is not behind its target.

Because we will only merge a Pull Request for which all tests pass. The following items need is true. We will provide assistance if not:

- The code is formatted (run `yarn foramt`).
- The code is linted (run `yarn lint`).
- The Pull Request title is written imperatively. See [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/#imperative) for a great explanation)

## How does documentation work?

- All reference documentation is data-driven through code comments. As you look through the codebase, model your comments like those in the surrounding code.
- If you're adding a new example, start by copying an existing one and follow the structure of its README and code as well.

## License

By contributing your code to the formium/formium GitHub repository, you agree to license your contribution under the [BSL license](../LICENSE).