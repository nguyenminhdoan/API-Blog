const router = require("express").Router();
const { createNewCategory, findCate } = require("../controller/category");
const { userAuth } = require("../middlewares/authorization.middleware");

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newCat = await createNewCategory(name);
    return res.json({ status: "success", data: newCat });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await findCate();
    res.json({ status: "success", data: cats });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});
module.exports = router;
