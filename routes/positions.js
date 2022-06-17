var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Position, validatePosition } = require('../models/Position');

router.get('/', async (req, res) => {
  const position = await Position.find();

  res.send(position);
});

router.post(
  '/',
  [auth, authorized.admin, validatePosition],
  async (req, res) => {
    let position = await Position.findOne({ name: req.body.name });

    if (position) return res.status(400).send('position already exists');

    position = new Position(req.body);

    position = await position.save();

    res.send(position);
  }
);

router.put(
  '/:id',
  [auth, authorized.admin, validatePosition],
  async (req, res) => {
    const position = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!position)
      return res
        .status(404)
        .send('The position with the given ID does not exist');

    res.send(position);
  }
);

router.delete('/:id', [auth, authorized.admin], async (req, res) => {
  const position = await Position.findByIdAndRemove(req.params.id);

  if (!position)
    return res
      .status(404)
      .send('The position with the given ID does not exist');

  res.send(position);
});

module.exports = router;
