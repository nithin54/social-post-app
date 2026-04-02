const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret-change-me"
    );

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};
