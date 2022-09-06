var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authorized = require('../middleware/authorize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: './public/images/voters/' });
const fs = require('fs');
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

router.get('/voted/:id', [auth, authorized.voter], async (req, res) => {
  let voter = await Voter.findById(req.params.id);

  voter.voted = true;

  voter = voter.save();

  res.send(voter);
});

router.post(
  '/',
  [validateVoter, upload.single('voter_photo')],
  async (req, res) => {
    let voter = await Voter.findOne({ idnumber: req.body.idnumber });

    if (voter) return res.status(400).send('voter already exists');

    const photo = req.file;
    const newPath = `public/images/voters/${photo.originalname}`;
    const path = `/images/voters/${photo.originalname}`;
    fs.rename(photo.path, newPath, (err) => {
      if (err) console.log('error:' + err);
      req.body.photo = path;
    });
    voter = new Voter(req.body);

    voter = await voter.save();

    res.send(voter);
  }
);

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

router.put('/code/:id', [auth, authorized.ecagent], async (req, res) => {
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
