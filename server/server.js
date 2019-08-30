const express = require('express');

const app = express();

app.use(express.static('dist'));

app.get('*', (req,res) => {
    res.status(404).send(`Sorry, that resource can't be found`);
});

module.exports = app;