require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const db = require('./db');
const router = require('./routes');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports.app = app;