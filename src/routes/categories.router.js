const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ status: "get" });
});

module.exports = router;
