const express = require("express");
const router = express.Router();
const { verifyAccessJWT, createAccessJWT } = require("../services/auth");
const { getProfileUser } = require("../controller/user");

router.get("/", async (req, res) => {
  const { authorization } = req.headers;

  const decoded = await verifyAccessJWT(authorization);
  if (!decoded.username)
    return res.status(403).json({
      message: "forbidden",
    });
  const userProfile = await getProfileUser(decoded.username);
  const dbRefreshToken = userProfile.refreshJWT.addedAt;

  tokenExp = tokenExp.setDate(tokenExp.getDate() + 30);
  const today = new Date();
  if (dbRefreshToken !== authorization && today > tokenExp) {
    return res.status(403).json({
      message: "forbidden",
    });
  }
  const accessJWT = await createAccessJWT(
    decoded.username,
    userProfile._id.toString()
  );
  return res.json({ status: "success", accessJWT });
});

module.exports = router;
