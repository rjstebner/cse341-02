const passport = require('passport');

const router = require('express').Router();
router.use("/", require("./swagger"));

router.get('/', (req, res) => {
  //#swagger.tags = ['Home']
  res.send(req.session.user !== undefined ? `logged in as ${req.session.user.displayName}` : "Not logged in")
});

router.use('/users', require('./users'));
router.use('/products', require('./products'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

module.exports = router;