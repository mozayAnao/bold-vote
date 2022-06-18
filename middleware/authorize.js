const authorize = {
  admin: (req, res, next) => {
    if (req.user.role === 'admin') return next();

    res.status(403).send('Access denied');
  },
  ecagent: (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'ecagent') return next();

    res.status(403).send('Access denied');
  },
  partyagent: (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'partyagent')
      return next();

    res.status(403).send('Access denied');
  },
  voter: (req, res, next) => {
    if (req.user.verified === true && req.user.voted === false) return next();

    res.status(403).send('Access denied');
  },
};

module.exports = authorize;
