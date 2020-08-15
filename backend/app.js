
// packages
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

// set app
const app = express();

// set upload path
app.use(express.static(path.join(`${__dirname}/files`)));

// bodyparser (for post requests)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/style.css', (req, res) => {
//   res.sendFile(path.join(`${__dirname}/testing/style.css`));
// });

app.get('/index.js', (req, res) => {
  fs.readFile(path.join(`${__dirname}/frontend/index.js`), 'utf8', (err, contents) => {
    res.contentType('application/javascript');
    res.send(contents);
  });
});

// endpoints
// require('./validation/validationRoute.js').setApp(app);

// front end
const feDirSegs = __dirname.split('/');
feDirSegs.length = feDirSegs.length - 1;
const feDir = feDirSegs.join('/');
require('../frontend/pages.js').setApp(app, `${feDir}/frontend`);

// hosted on localhost:1234
app.listen(1234);
