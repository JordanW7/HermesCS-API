require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
let dump = require("pg");
const app = express();



const auth = require('./controllers/auth');

//Database Setup
const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const whitelist = ['*'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.status(200).send('Hello World!')
})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// app.post('/signin', signin.signinAuthentication(db, bcrypt))
// app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
// app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
// app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
// app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})

const port = process.env.PORT || 3000
app.listen(port, () => 
  console.log(`Server is listening on port ${port}.`)
)