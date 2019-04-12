/* 3rd packages */
const express = require('express');
const mongoose = require('mongoose');

/* project packages */

/* Connect DB */
mongoose.connect('mongodb://localhost:27017/fs03-xedike', {useNewUrlParser: true})
    .then(console.log("Connected to DB"))
    .catch(console.log)

/* initialize server */
const app = express();

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Connected to server on ' + port)
})