const User = require("../model/User");

exports.getProfileUser = (username) => {
  return new Promise((resolve, reject) => {
    if (!username) return false;
    try {
      User.findOne({ username }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;
    try {
      User.findOne({ email }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserById = (_id) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;
    try {
      User.findOne({ _id }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
exports.updateNewPassword = (email, newHashPassword) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        {
          email,
        },
        {
          $set: {
            password: newHashPassword,
          },
        },
        {
          new: true,
        }
      )
        .then((data) => resolve(data))

        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
exports.register = async (newObjUser) => {
  return new Promise((resolve, reject) => {
    User(newObjUser)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
exports.storeUserRefreshJWT = (_id, token) => {
  console.log(_id);
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        {
          _id,
        },
        {
          $set: {
            "refreshJWT.token": token,
            "refreshJWT.addedAt": Date.now(),
          },
        },
        {
          new: true,
        }
      )
        .then((data) => resolve(data))

        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
