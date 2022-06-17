var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Voter, validateVoter } = require('../models/Voter');

/* GET voters listing. */
router.get('/', auth, async (req, res) => {
  const voters = await Voter.find();

  res.send(voters);
});

router.get('/:id', auth, async (req, res) => {
  const voter = await Voter.findById(req.params.id).select('-code');

  res.send(voter);
});

router.post('/', [auth, authorized.admin, validateVoter], async (req, res) => {
  let voter = await Voter.findOne({ idnumber: req.body.idnumber });

  if (voter) return res.status(400).send('voter already exists');

  voter = new Voter(req.body);

  voter = await voter.save();

  res.send(token);
});

router.put(
  '/:id',
  [auth, authorized.admin, validateVoter],
  async (req, res) => {
    let voter = await Voter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!voter)
      return res.status(404).send('The Voter with the given ID does not exist');

    res.send(voter);
  }
);

router.put('/code/:id', [auth, authorized.admin], async (req, res) => {
  let voter = await Voter.findById(req.params.id);

  if (!voter)
    return res.status(404).send('The Voter with the given ID does not exist');

  const salt = await bcrypt.genSalt(10);
  voter.code = await bcrypt.hash(req.body.code, salt);

  voter = voter.save();

  res.send(voter);
});

router.delete('/:id', [auth, authorized.admin], async (req, res) => {
  const voter = await Voter.findByIdAndRemove(req.params.id);

  if (!voter)
    return res.status(404).send('The voter with the given ID does not exist');

  res.send(voter);
});

module.exports = router;
