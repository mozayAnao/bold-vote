const mongoose = require('mongoose');
const Joi = require('joi');

const aspirantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  position: {
    type: String,
    required: true,
    minlength: 3,
  },
  ballotNumber: {
    type: Number,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const Aspirant = mongoose.model('Aspirant', aspirantSchema);

const validateAspirant = async (req, res, next) => {
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
              err.message = 'name should not be empty!';
              break;
            case 'string.min':
              err.message = `name should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `name should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    position: Joi.string()
      .min(3)
      .max(100)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'position should not be empty!';
              break;
            case 'string.min':
              err.message = `position should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `position should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    ballotNumber: Joi.number().required(),
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

exports.Aspirant = Aspirant;
exports.validateAspirant = validateAspirant;
