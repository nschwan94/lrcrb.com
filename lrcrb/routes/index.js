var express = require('express');
var nodemailer = require('nodemailer');
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


// nodemailer integration
// Configure Nodemailer transporter (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false, // Use true for TLS, false for STARTTLS
  auth: {
    user: 'longlivelimerick@gmail.com',
    pass: 'coyc sxwa tzja gmav'
  }
});

// Handle POST request from email submission form
router.post('/submit-email', (req, res) => {
  const email = req.body.email;

  // Send email using Nodemailer
  const mailOptions = {
    from: 'Lime Rick <longlivelimerick@gmail.com>',
    to: [email],
    subject: 'Email submitted',
    text: 'Thank you for your interest in lrcrb.com at this time. There is much going on, and I invite you to follow @lrcrb_ldl on X.com for updates. Stay Limey and Make Them Pucker!'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send({ data: 'Error sending email'});
    } else {
      console.log(`Email sent: ${info.response}`);
      res.send({ data: 'Email submitted successfully!'});
    }
  });
});




module.exports = router;
