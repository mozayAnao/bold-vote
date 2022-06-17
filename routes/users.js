var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/User');

/* GET users listing. */
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.send(user);
});

router.post('/', [auth, authorized.admin, validateUser], async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send('User already exists');

  user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  res.send(_.pick(user, ['_id', 'lastname', 'firstname', 'email', 'role']));
});

router.delete('/:id', [auth, authorized.admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send('The user with the given ID does not exist');

  res.send(user);
});

module.exports = router;
