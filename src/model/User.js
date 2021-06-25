const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    refreshJWT: {
      token: {
        type: String,
        maxlength: 500,
        default: "",
      },
      addedAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
