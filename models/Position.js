const mongoose = require('mongoose');
const Joi = require('joi');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true,
  },
});

const Position = mongoose.model('Position', positionSchema);

const validatePosition = async (req, res, next) => {
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

    type: Joi.string().required(),
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

exports.Position = Position;
exports.validatePosition = validatePosition;
