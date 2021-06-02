const Category = require("../model/Category");

exports.createNewCategory = (name) => {
  return new Promise((resolve, reject) => {
    Category({ name })
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

exports.findCate = () => {
  return new Promise((resolve, reject) => {
    try {
      Category.find((error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
