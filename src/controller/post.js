const Post = require("../model/Post");

exports.createNewPost = (objPost) => {
  return new Promise((resolve, reject) => {
    try {
      Post(objPost)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error.message);
    }
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

exports.deletePost = ({ _id, clientId }) => {
  return new Promise((resolve, reject) => {
    try {
      Post.findOneAndDelete({ _id, clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

exports.getAllPost = (username, catName) => {
  return new Promise((resolve, reject) => {
    try {
      let posts;
      if (username) {
        posts = Post.find({ username })

          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } else if (catName) {
        posts = posts = Post.find({
          categories: {
            $in: [catName],
          },
        })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } else {
        posts = Post.find()
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// exports.paginate = (skip, limit) => {
//   return new Promise((resolve, reject) => {
//     try {
//       Post.find()
//         .skip(skip)
//         .limit(limit)
//         .then((data) => resolve(data))
//         .catch((error) => reject(error));
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

exports.searchAllPosts = (txtSearch) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ title: { $regex: txtSearch } })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error.message);
    }
  });
};

exports.search = (txtSearch, limit, skip) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ title: { $regex: txtSearch } })
        .skip(skip)
        .limit(limit)
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error.message);
    }
  });
};
