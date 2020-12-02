import { NextApiRequest, NextApiResponse } from 'next'
import { formium } from '../../lib/formium'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for the presence of the id in the query string
  if (!req.query.id) {
    return res.status(400).json({ message: 'Invalid request.' })
  }

  // Fetch the form to check if the provided `id` exists
  const form = await formium.getFormById(req.query.id)

  // If the it doesn't exist prevent preview mode from being enabled
  if (!form) {
    return res.status(404).json({ message: 'Form not found' })
  }

  // If the request has a revisionId, it means it's for a preview, so
  // we set res.setPreviewData as an object with the revisionId. This is a cookie
  // that will be used by our Next.js page to fetch the correct data.
  // The reason we don't fetch the form revision here is because we are limited
  // by the size of the cookie we can set.
  // @see https://nextjs.org/docs/advanced-features/preview-mode
  if (req.query.revisionId) {
    res.setPreviewData({
      revisionId: req.query.revisionId,
    })
  }

  // Redirect to the path from the fetched form
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: '/forms/' + form.slug })
  res.end()
}
