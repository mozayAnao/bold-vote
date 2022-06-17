const Joi = require('joi');

const validateAuth = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
      .min(5)
      .max(255)
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .min(5)
      .max(255)
      .required(),
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

module.exports = validateAuth;
