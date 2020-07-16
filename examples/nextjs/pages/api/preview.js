// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  if (!req.query.slug || !req.query.id) {
    return res.status(401).json({ message: 'Invalid request' });
  }

  // Fetch the form to check if the provided `id` exists
  // If there is a revision, include it in the request
  const url = `${process.env.REACT_APP_API_URL}/v1/form/${req.query.id}`;

  const form = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FORMIUM_TOKEN}`,
      'X-Formik-Revision': req.query.revisionId,
    },
  })
    .then(r => r.json())
    .catch(e => console.log(e));

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!form) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  if (req.query.revisionId) {
    // Enable Preview Mode by setting the cookies
    res.setPreviewData({
      'X-Formik-Revision': req.query.revisionId,
    });
  }

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: '/forms/' + post.slug });
  res.end();
};
