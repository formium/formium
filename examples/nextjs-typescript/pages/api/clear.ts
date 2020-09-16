// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

// This route is useful for clearing the cookie set by /api/preview in your next.js app.
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Empty the preview cookie
  res.setPreviewData({})
  return res.status(200).json({ ok: true })
}

export default handler
