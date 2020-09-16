// This route is useful for clearing the cookie set by /api/preview in your next.js app.
export default async (req, res) => {
  res.setPreviewData({});
  return res.status(200).json({ ok: true });
};
