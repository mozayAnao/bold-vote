const mongoose = require('mongoose');
const Joi = require('joi');

const voteCountSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
    minlength: 3,
  },
  aspirant: {
    type: String,
    required: true,
    minlength: 3,
  },
  votes: {
    type: Number,
  },
});

const VoteCount = mongoose.model('VoteCount', voteCountSchema);

const validateVoteCount = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
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

    aspirant: Joi.string()
      .min(3)
      .max(100)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case 'any.empty':
              err.message = 'aspirant should not be empty!';
              break;
            case 'string.min':
              err.message = `aspirant should have at least ${err.local.limit} characters!`;
              break;
            case 'string.max':
              err.message = `aspirant should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),

    votes: Joi.Number(),
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

exports.VoteCount = VoteCount;
exports.validateVoteCount = validateVoteCount;
