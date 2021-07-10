const router = require("express").Router();
const {
  register,
  getProfileUser,
  getUserById,
  storeUserRefreshJWT,
  getUserByEmail,
  updateNewPassword,
  findByIdAndUpdate,
} = require("../controller/user");
const {
  hashPassword,
  comparePassword,
  createAccessJWT,
  createRefreshJWT,
} = require("../services/auth");
const {
  setPasswordReset,
  getPinEmail,
  deletePin,
} = require("../controller/resetPin");
const { userAuth } = require("../middlewares/authorization.middleware");
const {
  createNewUserValid,
  resetPasswordReqValid,
  updatePasswordReqValid,
} = require("../middlewares/formAuthorization");
const { deleteJWT } = require("../services/redis");
const { emailProcessor } = require("../services/email");

// GET user profile
router.get("/", userAuth, async (req, res) => {
  const _id = req.userId;
  const userProfile = await getUserById(_id);
  const { username, email, profilePic } = userProfile;

  res.json({
    user: {
      _id: _id,
      username: username,
      email: email,
      profilePic: profilePic,
    },
  });
});

//REGISTER
router.post("/register", createNewUserValid, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const passwordHashed = await hashPassword(password);

    const newObjUser = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: passwordHashed,
    };

    const newUser = await register(newObjUser);
    return res.json({
      status: "success",
      message: "new user has been created",
    });
  } catch (err) {
    // res.status(500).json(err);
    let msg = "E11000 duplicate key error collection";
    res.json({
      status: "error",
      message: `${
        msg
          ? `Email has already exist, please choose another email`
          : err.message
      }`,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({
      status: "error",
      message: "Invalid form submit",
    });

  const user = await getProfileUser(username);
  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({
      status: "error",
      message: " email or password are not correct",
    });

  const result = await comparePassword(password, passFromDb);

  // if (!result)
  //   return res.json({
  //     status: "error",
  //     message: "Invalid email or password",
  //   });

  const accessJWT = await createAccessJWT(user.username, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.username, `${user._id}`);

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

// Log out

router.delete("/logout", userAuth, async (req, res) => {
  try {
    const { authorization } = req.headers;
    // this data coming form database
    const _id = req.userId;
    deleteJWT(authorization);

    // delete refresh token from mongodb
    const result = await storeUserRefreshJWT(_id, "");

    if (result._id) {
      return res.json({ status: "success", message: "Log out successfully" });
    }
    res.json({ status: "error", message: "cannot log out, please try later" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/reset-password", resetPasswordReqValid, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  // console.log(user);

  if (user && user._id) {
    const setPin = await setPasswordReset(email);
    const result = await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });
    return res.json({
      status: "success",
      message:
        "We have sent the reset pin by email, please check your email!!!",
    });
  }
  return res.json({
    status: "error",
    message: "We have sent the reset pin by email, please check your email!!!",
  });
});

router.patch("/reset-password", updatePasswordReqValid, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinEmail(email, pin);

  if (getPin._id) {
    const databaseDate = getPin.addedAt;
    const expiredIn = 1;

    let expiredDate = databaseDate.setDate(databaseDate.getDate() + expiredIn);
    const today = new Date();
    if (today > expiredDate) {
      return res.json({
        status: "error",
        message: "Invalid Pin or Expired Pin",
      });
    }
    const hashedNewPassword = await hashPassword(newPassword);
    const user = await updateNewPassword(email, hashedNewPassword);
    if (user._id) {
      await emailProcessor({ email, type: "password-update-success" });
      await deletePin(email, pin);
      return res.json({
        status: "success",
        message: "Your password has been updated successfully",
      });
    }
  }
});

// update account
router.put("/:id", userAuth, async (req, res) => {
  const _id = req.userId;
  const { id } = req.params;
  const { username, email, password, profilePic } = req.body;

  if (_id === id) {
    try {
      const passwordHashed = await hashPassword(password);

      const newObjUserUpdate = {
        username,
        email,
        profilePic,
        password: passwordHashed,
      };

      const result = await findByIdAndUpdate(_id, newObjUserUpdate);

      if (result) {
        return res.json({
          status: "success",
          data: result,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  } else {
    return res.json({
      status: "error",
      message: "this username or email has already existed, please try again",
    });
  }
});

module.exports = router;
