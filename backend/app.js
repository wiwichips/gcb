
// packages
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

// set app
const app = express();

// set upload path
app.use(fileUpload())
app.use(express.static(path.join(`${__dirname}/files`)));

// bodyparser (for post requests)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// endpoints
require('./routes.js').setApp(app, `${__dirname}/files`);

// front end
const feDirSegs = __dirname.split('/');
feDirSegs.length = feDirSegs.length - 1;
const feDir = feDirSegs.join('/');
require('../frontend/pages.js').setApp(app, `${feDir}/frontend`);

// hosted on localhost:1234
app.listen(1234);
