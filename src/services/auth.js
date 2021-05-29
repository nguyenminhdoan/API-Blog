const jwt = require("jsonwebtoken");
const privateKeyAccess = "Kdsadasd@!#12edsadas";
const privateReset = "Kdsadasd@!#12ed213sadcz";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { setJWT } = require("./redis");
const { storeUserRefreshJWT } = require("../controller/user");

exports.hashPassword = (newPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(newPassword, saltRounds));
  });
};

exports.comparePassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.createAccessJWT = async (username, id) => {
  try {
    const accessJWT = jwt.sign({ username }, privateKeyAccess, {
      expiresIn: "30m",
    });
    await setJWT(accessJWT, id);
    return Promise.resolve(accessJWT);
  } catch (error) {
    console.log(error);
  }
};

exports.createRefreshJWT = async (username, id) => {
  try {
    const refreshJWT = jwt.sign({ username }, privateReset, {
      expiresIn: "30d",
    });

    const result = await storeUserRefreshJWT(id, refreshJWT);

    return Promise.resolve(refreshJWT);
  } catch (error) {
    console.log(error);
  }
};

exports.verifyAccessJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, privateKeyAccess));
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, privateReset));
  } catch (error) {
    return Promise.reject(error);
  }
};
