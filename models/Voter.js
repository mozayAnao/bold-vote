const mongoose = require('mongoose');
const Joi = require('joi');

const voterSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  othername: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  idnumber: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 100,
    unique: true,
  },
  photo: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  voted: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
  },
});

const Voter = mongoose.model('Voter', voterSchema);

const validateVoter = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    lastname: Joi.string()
      .min(3)
      .max(100)
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
      .max(100)
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

    othername: Joi.string()
      .min(3)
      .max(100)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
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

    idnumber: Joi.string().min(3).required(),

    phone: Joi.string().required(),

    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'org'] },
      })
      .min(10)
      .max(100)
      .required(),

    photo: Joi.string().min(5).max(100),

    verified: Joi.boolean(),

    voted: Joi.boolean(),
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

exports.Voter = Voter;
exports.validateVoter = validateVoter;
