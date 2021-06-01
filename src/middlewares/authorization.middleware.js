const { verifyAccessJWT } = require("../services/auth");
const { getJWT, deleteJWT } = require("../services/redis");

exports.userAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const decoded = await verifyAccessJWT(authorization);
  if (decoded.username) {
    const userId = await getJWT(authorization);
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userId = userId;
    return next();
  }
  deleteJWT(authorization);
  return res.status(403).json({ message: "Forbidden" });
};
