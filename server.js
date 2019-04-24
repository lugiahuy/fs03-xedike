/* 3rd packages */
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');

require('dotenv').config();

/* project packages */

/* Connect DB */
mongoose.connect('mongodb+srv://lugiahuy:lugiahuy1997@cluster0-fipio.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
    .then(console.log("Connected to DB"))
    .catch(console.log)

/* initialize server */
const app = express();

/* middlewares */
app.use('/uploads', express.static('uploads'))
// parser
app.use(express.urlencoded({ extended: false }))
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