const router = require("express").Router();
const { register, getProfileUser, getUserById } = require("../controller/user");
const {
  hashPassword,
  comparePassword,
  createAccessJWT,
  createRefreshJWT,
} = require("../services/auth");

const { userAuth } = require("../middlewares/authorization.middleware");
//REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const passwordHashed = await hashPassword(password);

    const newObjUser = {
      username,
      email,
      password: passwordHashed,
    };

    const newUser = await register(newObjUser);
    return res.json({ status: newUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({
      status: "failed",
      message: "Invalid form submit",
    });

  const user = await getProfileUser(username);
  console.log(user);
  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({
      status: "error",
      message: "Invalid email or password",
    });

  const result = await comparePassword(password, passFromDb);

  if (!result)
    return res.json({
      status: "failed",
      message: "Invalid email or password",
    });

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login Successfully",
    accessJWT,
    refreshJWT,
  });
});

// GET USER by id
router.get("/:id", userAuth, async (req, res) => {
  const id = req.userId;
  try {
    const user = await getUserById(id);
    res.json({ status: user });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
