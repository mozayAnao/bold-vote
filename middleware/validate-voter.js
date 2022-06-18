const Joi = require('joi');

const validateVoter = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    idnumber: Joi.string().min(3).max(255).required(),

    code: Joi.string().min(5).max(255).required(),
  });

  try {
    const value = await schema.validateAsync(data);
    // console.log(value);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.details[0].message });
  }
};

module.exports = validateVoter;
