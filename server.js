/* 3rd packages */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

/* project packages */

/* Connect DB */
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(console.log("Connected to DB"))
    .catch(console.log)

/* initialize server */
const app = express();

/* middlewares */
// parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// passport
app.use(passport.initialize());
require('./config/passport')(passport)
// router
app.use('/api/users', require('./routes/api/users'))

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Connected to server on ' + port)
})