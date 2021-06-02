const router = require("express").Router();
const {
  createNewPost,
  findPostById,
  updatePost,
  deletePost,
  getAllPost,
} = require("../controller/post");
const { userAuth } = require("../middlewares/authorization.middleware");
const { createNewPostValid } = require("../middlewares/formAuthorization");

// create new post
router.post("/", createNewPostValid, userAuth, async (req, res) => {
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
router.put("/:id", userAuth, async (req, res) => {
  const { username, desc, title } = req.body;
  const id = req.userId;

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
router.delete("/:id", userAuth, async (req, res) => {
  const id = req.userId;
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
router.get("/:id", userAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const post = await findPostById(id);
    if (post._id) {
      return res.json({ status: "success", data: post });
    }
    res.json({ status: "error", message: "Post not found  " });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Get all posts by users
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
