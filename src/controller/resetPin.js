const { modelName } = require("../model/ResetPin");
const ResetPin = require("../model/ResetPin");

const randomPinPassword = (length) => {
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
};

const setPasswordReset = async (email) => {
  // create random pin (6 digits)
  const pinLength = 6;
  const randomPin = await randomPinPassword(pinLength);
  const resetObj = {
    email: email,
    pin: randomPin,
  };
  return new Promise((resolve, reject) => {
    ResetPin(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinEmail = async (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPin.findOne({ email, pin }, (error, data) => {
        if (error) {
          resolve(false);
          console.log(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const deletePin = async (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPin.findOneAndDelete({ email, pin }, (error, data) => {
        if (error) {
          reject(false);
          console.log(error);
        }
        resolve(data);
      });
    } catch (error) {
      console.log(error);
    }
  });
};
module.exports = {
  setPasswordReset,
  getPinEmail,
  deletePin,
};
