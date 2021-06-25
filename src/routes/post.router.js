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
router.put("/:_id", userAuth, async (req, res) => {
  const { desc, title } = req.body;
  const { _id } = req.params;
  const userId = req.userId;

  try {
    const post = await findPostById(_id);
    console.log(typeof userId);
    if (userId === post.clientId.toString()) {
      const postUpdate = await updatePost(_id, desc, title);
      res.json({ status: "success", data: postUpdate });
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Delete post
router.delete("/:_id", userAuth, async (req, res) => {
  const clientId = req.userId;
  console.log(clientId);
  const { _id } = req.params;
  try {
    const result = await deletePost({ _id, clientId });
    console.log(result);

    if (result) {
      return res.json({
        status: "success",
        message: "Post has been deleted...",
        result,
      });
    } else {
      return res.json({
        status: "error",
        message: "Something wrong please try again",
      });
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
    if (post._id) {
      return res.json({ status: "success", data: post });
    }
    res.json({ status: "error", message: "Post not found  " });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const username = req.query.user;
    const catName = req.query.cat;
    const result = await getAllPost(username, catName);
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
