const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500,
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'ecagent', 'partyagent'],
    required: true,
  },
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
  // isStoreOwner: {
  //   type: Boolean,
  //   default: false,
  // },
  password: {
    type: String,
    min: 5,
    max: 1024,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      thisname: this.firstname,
      email: this.email,
      role: this.role,
    },
    config.get('jwtPrivateKey')
  );

  return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    lastname: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'Last name should not be empty!';
              break;
            case 'string.min':
              err.message = `Last name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `Last name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    firstname: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'First name should not be empty!';
              break;
            case 'string.min':
              err.message = `First name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `First name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
      .min(5)
      .max(255)
      .required(),

    role: Joi.string().required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .min(5)
      .max(255)
      .required(),
  });

  try {
    const value = await schema.validateAsync(data);
    console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.details[0].message });
  }
};

exports.User = User;
exports.validateUser = validateUser;
