const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

const username = Joi.string().min(3).max(50).required();
const password = Joi.string().min(3).max(50).required();
const newPassword = Joi.string().min(3).max(50).required();
const pin = Joi.number().min(100000).max(999999).required();
const title = Joi.string().min(3).required();
const desc = Joi.string().min(3).required();

exports.createNewUserValid = (req, res, next) => {
  const schema = Joi.object({
    username: username,
    password: password,
    email: email,
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

exports.resetPasswordReqValid = (req, res, next) => {
  const schema = Joi.object({ email });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

exports.updatePasswordReqValid = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

exports.createNewPostValid = (req, res, next) => {
  const schema = Joi.object({ title, desc, username });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
};
