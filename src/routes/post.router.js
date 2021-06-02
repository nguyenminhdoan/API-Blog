const router = require("express").Router();
const {
  createNewPost,
  findPostById,
  updatePost,
  deletePost,
  getAllPost,
} = require("../controller/post");
const { userAuth } = require("../middlewares/authorization.middleware");

// create new post
router.post("/", userAuth, async (req, res) => {
  try {
    const { title, desc, photo, username, categories } = req.body;
    const userId = req.userId;
    const objPost = {
      clientId: userId,
      title,
      desc,
      photo,
      username,
      categories,
    };
    const newPost = await createNewPost(objPost);
    return res.json({ status: "success", data: newPost });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// update post
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { username, desc, title } = req.body;
  try {
    const post = await findPostById(id);
    if (post.username === username) {
      const postUpdate = await updatePost(id, desc, title);
      res.json({ status: "error", data: postUpdate });
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  try {
    const post = await findPostById(id);
    if (post.username === username) {
      await deletePost(id);
      return res.json({
        status: "success",
        message: "Post has been deleted...",
      });
    } else {
      res.json({ status: "error", message: "you can only delete your post!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Get specific post
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await findPostById(id);
    return res.json({ status: "success", data: post });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Get all posts
router.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getAllPost(userId);
    if (result.length) {
      return res.json({
        status: "success",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});
module.exports = router;
