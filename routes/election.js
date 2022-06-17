var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Election, validateElection } = require('../models/Election');

router.get('/', async (req, res) => {
  const election = await Election.find();

  res.send(election);
});

router.post(
  '/',
  [auth, authorized.admin, validateElection],
  async (req, res) => {
    let election = await Election.findOne({ name: req.body.name });

    if (election) return res.status(400).send('Election already exists');

    election = new Election(req.body);

    election = await election.save();

    res.send(election);
  }
);

router.put(
  '/:id',
  [auth, authorized.admin, validateElection],
  async (req, res) => {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!election)
      return res
        .status(404)
        .send('The election with the given ID does not exist');

    res.send(election);
  }
);

router.delete('/:id', [auth, authorized.admin], async (req, res) => {
  const election = await Election.findByIdAndRemove(req.params.id);

  if (!election)
    return res
      .status(404)
      .send('The election with the given ID does not exist');

  res.send(election);
});

module.exports = router;
