var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Aspirant, validateAspirant } = require('../models/aspirant');

router.get('/', auth, async (req, res) => {
  const aspirants = await Aspirant.find();

  res.send(aspirants);
});

router.get('/:id', auth, async (req, res) => {
  const aspirant = await Aspirant.findById(req.params.id);

  if (!aspirant)
    return res
      .status(404)
      .send('The Aspirant with the given ID does not exist');

  res.send(aspirant);
});

router.post(
  '/',
  [auth, authorized.admin, validateAspirant],
  async (req, res) => {
    let aspirant = await Aspirant.findOne({ name: req.body.name });

    if (aspirant) return res.status(400).send('aspirant already exists');

    aspirant = new Aspirant(req.body);

    aspirant = await aspirant.save();

    res.send(aspirant);
  }
);

router.put(
  '/:id',
  [auth, authorized.admin, validateAspirant],
  async (req, res) => {
    const aspirant = await Aspirant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!aspirant)
      return res
        .status(404)
        .send('The aspirant with the given ID does not exist');

    res.send(aspirant);
  }
);

router.put('/vote/:id', [auth, authorized.voter], async (req, res) => {
  let aspirant = await Aspirant.findById(req.params.id);

  if (!aspirant) return res.status(400).send('Invalid Request');

  aspirant.votes += 1;

  aspirant = aspirant.save();

  res.redirect(`/voters/voted/${req.user._id}`);
});

router.delete('/:id', [auth, authorized.admin], async (req, res) => {
  const aspirant = await Aspirant.findByIdAndRemove(req.params.id);

  if (!aspirant)
    return res
      .status(404)
      .send('The aspirant with the given ID does not exist');

  res.send(aspirant);
});

module.exports = router;
