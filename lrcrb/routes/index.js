var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/red", (req, res) => {
  res.render('users')
});

router.get("/black", (req, res) => {
  res.render('black')
});

router.get("/white", (req, res) => {
  res.render('users')
});

router.get("/blue", (req, res) => {
  res.render('users')
});



module.exports = router;
