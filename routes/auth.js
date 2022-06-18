var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validateAuth = require('../middleware/validate-login');
const validateVoter = require('../middleware/validate-voter');
const { User } = require('../models/User');
const { Voter } = require('../models/Voter');

router.post('/admin', validateAuth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  res.send(token);
});

router.post('/voter', validateVoter, async (req, res) => {
  let voter = await Voter.findOne({ idnumber: req.body.idnumber });
  if (!voter) return res.status(400).send('Invalid ID number or code');

  if (voter.verified === false)
    return res.status(400).send('Sorry!, you have not been verified to vote');

  if (voter.voted === true)
    return res.status(400).send('Sorry!, you have already voted');

  const validPassword = await bcrypt.compare(req.body.code, voter.code);
  if (!validPassword) return res.status(400).send('Invalid ID number or code');

  const token = voter.generateAuthToken();

  res.send(token);
});

module.exports = router;
