var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
const { MongoClient } = require('mongodb');
// loads env variables form config .env
require('dotenv').config();

// MONGO DB
const mongouri = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI_PRODUCTION : process.env.NODE_ENV === "production_local" ? process.env.MONGODB_URI_PUBLIC : process.env.MONGODB_URI_DEVELOPMENT
const dbName = 'lrcrb';
const collectionName = 'users';
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

router.get("/confirm-email", async (req, res) => {
  if (req.query.email) {
    // user has confirmed an email
    // modify db entry
    try {
      await confirmUser(req.query.email);
      res.render('email-confirm-success');
    } catch (err) {
      res.render('email-confirm-error');
    }
  } else {
    res.render('email-confirm-error');
  }
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

const addUser = async (user) => {
  let client;
  try {  
    console.log('adding user', mongouri);
    client = await MongoClient.connect(mongouri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(user);
    console.log(`Document inserted with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close()
  }
};

const removeUser = async (user) => {
  let client;
  try {  
    client = await MongoClient.connect(mongouri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne(user);
    console.log(`Document deleted with ID: ${result.deletedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close()
  }
};

const confirmUser = async (email) => {
  let client;
  try {  
    client = await MongoClient.connect(mongouri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { email };
    const updateObject = { $set: { verified: true } }; 

    const result = await collection.updateOne(query, updateObject);
    console.log(`Document updated with ID: ${result.updatedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close()
  }
}

  

// Handle POST request from email submission form
router.post('/submit-email', async (req, res) => {
  const email = req.body.email;
  const link = process.env.NODE_ENV === 'production' ? "https://lrcrb.com/confirm-email?email=" : "http://localhost:3000/confirm-email?email="

  const htmlContent = `
    <div>
      <h1>Become a LRCRB+ member today for the low price of $0 ($0.00 billed annually)</h1>
      <p>Thank you for your interest in lrcrb.com at this time. Click the button below to confirm your subscription.</p>
      <a href="${link}${email}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; font-size: 16px; display: inline-block; border: none; cursor: pointer;">Confirm Subscription * ** ***</a>
      <p>*membership is permanent and can only be revoked in international waters or space.</p>
      <p>**basic content doesn't require login; plus content will require login thru email.</p>
      <p>***it would be nice of you to ping @LRCRB_LDL to identify yourself in some manner.</p>
    </div>
    `;

  // Send email using Nodemailer
  const mailOptions = {
    from: 'Lime Rick <longlivelimerick@gmail.com>',
    to: [email],
    subject: 'Join LRCRB+ Today',
    html: htmlContent,
  };

  // add to database
  try {
    await addUser({
      email,
      verified: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ data: 'Error sending email'});
    return;
  }

  // send the email
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error(error);
      // the email fails to send, remove the user from the db
      try {
        await removeUser({ email });
        res.status(500).send({ data: 'Error sending email'});
      }
      catch (err) {
        console.error(err);
      }
    } else {
      console.log(`Email sent: ${info.response}`);
      res.send({ data: 'Email submitted successfully!'});
    }
  });
});


module.exports = router;
