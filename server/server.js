require('dotenv').config({ path: __dirname + '/../.env' });
console.log(process.env.DATABASE_URL);
const express = require('express');
const db = require('./db');
const router = require('./routes');
const app = express();

app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports.app = app;
