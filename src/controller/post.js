const Post = require("../model/Post");

exports.createNewPost = (objPost) => {
  return new Promise((resolve, reject) => {
    Post(objPost)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

exports.findPostById = (_id) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;
    try {
      Post.findOne({ _id }, (error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

exports.updatePost = (_id, desc, title) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOneAndUpdate(
        {
          _id,
        },
        {
          $set: {
            desc,
            title,
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
    }
  });
};

exports.deletePost = (_id) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findByIdAndDelete({ _id })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllPost = (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {}
  });
};
