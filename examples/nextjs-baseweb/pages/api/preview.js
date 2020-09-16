import { formium } from '../../lib/formium';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (!req.query.slug || !req.query.id) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const form = await formium.getFormById(req.query.id);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!form) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  if (req.query.revisionId) {
    // Enable Preview Mode by setting the cookies
    res.setPreviewData({
      revisionId: req.query.revisionId,
    });
  }

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: '/forms/' + form.slug });
  res.end();
};
