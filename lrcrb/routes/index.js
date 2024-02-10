var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/red", (req, res) => {
  res.render('red')
});

router.get("/black", (req, res) => {
  res.render('black')
});

router.get("/blue", (req, res) => {
  res.render('blue')
});

router.get("/white", (req, res) => {
  res.render('white')
});

router.get("/blue", (req, res) => {
  res.render('users')
});



module.exports = router;
