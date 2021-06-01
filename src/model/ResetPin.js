const { Schema, model } = require("mongoose");

const ResetPinSchema = new Schema({
  pin: {
    type: String,
    maxlength: 6,
    minlength: 6,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const ResetPin = model("reset-pin", ResetPinSchema);
module.exports = ResetPin;
