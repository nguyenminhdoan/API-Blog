const redis = require("redis");
const client = redis.createClient("redis://localhost:6379 ");

exports.setJWT = function (key, value) {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err);
        resolve(res);
        // console.log(key, value);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.getJWT = function (key) {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteJWT = function (key) {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
};
