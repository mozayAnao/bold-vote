const mongoose = require('mongoose');
const Joi = require('joi');

const electionShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  institution: {
    type: String,
    required: true,
    minlength: 3,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Election = mongoose.model('Election', electionShema);

const validateElection = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    name: Joi.string()
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

    institution: Joi.string()
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

    date: Joi.date().required(),
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

exports.Election = Election;
exports.validateElection = validateElection;
