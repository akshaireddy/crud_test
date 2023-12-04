// index.js
const express = require('express');
const bodyParser = require('body-parser');
const authModule = require('./src/authModule');

const mainApp = express();
const port = 3000;

mainApp.use(bodyParser.json());

// Additional routes for the main application
mainApp.get('/', (req, res) => {
  res.send('Hello, this is the main application!');
});

// Mount the authModule as a middleware under the '/auth' path
mainApp.use('/auth', authModule);

mainApp.listen(port, () => {
  console.log(`Main Application is running on http://localhost:${port}`);
});
