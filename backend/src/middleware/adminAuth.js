function adminAuth(req, res, next) {
  const expectedToken = process.env.ADMIN_API_KEY;

  if (!expectedToken) {
    return next();
  }

  const token = req.headers["x-admin-key"];
  if (token !== expectedToken) {
    return res.status(401).json({ message: "Unauthorized admin request" });
  }

  next();
}

module.exports = adminAuth;
