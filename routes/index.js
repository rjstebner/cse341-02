const router = require('express').Router();
router.use("/", require("./swagger"));

router.get('/', (req, res) => {
  //#swagger.tags = ['Home']
  res.send(`
    <html>
      <body>
        <h1>Welcome to the API</h1>
        <ul>
          <li><a href="/users">Users</a></li>
          <li><a href="/products">Products</a></li>
        </ul>
      </body>
    </html>
  `);
});

router.use('/users', require('./users'));
router.use('/products', require('./products'));

module.exports = router;