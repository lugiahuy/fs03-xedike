/* 3rd packages */
const express = require('express');

/* project packages */

/* initialize server */
const app = express();

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Connected to DB on ' + port)
})