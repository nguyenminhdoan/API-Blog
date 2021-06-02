const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);

module.exports = Post;
