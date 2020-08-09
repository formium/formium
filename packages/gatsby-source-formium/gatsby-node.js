const crypto = require('crypto');
const fetch = require('@zeit/fetch-retry')(require('node-fetch'));
const { createClient } = require('@formium/client');

const digest = i =>
  crypto
    .createHash('md5')
    .update(JSON.stringify(i))
    .digest('hex');

exports.sourceNodes = async ({ actions, cache }, options = {}) => {
  const { createNode } = actions;
  const {
    projectId,
    accessToken,
    baseUrl = 'https://api.formium.io',
  } = options;
  const client = createClient(projectId, {
    baseUrl,
    apiToken: accessToken,
    fetchImplementation: fetch,
  });
  // @see https://www.gatsbyjs.org/docs/creating-a-source-plugin/
  // get the last timestamp from the cache
  const updateStartAt = await cache.get(`timestamp`);
  try {
    // Create nodes here, generally by downloading data
    // from a remote API.
    const { data: forms } = await client.findForms({
      limit: 100,
      updateStartAt,
    });
    let children = [];
    forms.forEach(form => {
      children.push(form.slug);
      const node = {
        ...form,
        parent: null,
        children: [],
      };
      node.internal = {
        type: 'FormiumForm',
        contentDigest: digest(node),
      };
      createNode(node);
    });
  } catch (e) {
    console.log(e);
  }

  // We're done, return.
  return;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type FormiumForm implements Node {
      schema: JSON
    }
  `;
  createTypes(typeDefs);
};

exports.onPostBuild = async ({ cache }) => {
  // set a timestamp at the end of the build
  await cache.set(`timestamp`, new Date().toISOString());
};
