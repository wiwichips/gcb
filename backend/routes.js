const bodyParser = require('body-parser');
const dcpJob = require('./dcp.js');
const classify = require('./classify.js');
const fs = require('fs');
const path = require('path');

// these are the routes that are exported to app.js
exports.setApp = (app, rootDirectory) => {
  // for parsing application/json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/example', (req, res) => {
    // call function here

    // enter this in a .then() if making an async call
    res.send({
      valid: false,
    });
  });

  app.get('/example', (req, res) => {
    console.log('hi, you just made a get request to /example');

    dcpJob.runJob();

    res.send({
      message: 'hello world. You should see me in your browser',
    });
  });

  app.get('/load-model', (req, res) => {
    classify.classifyImage().then((str) => {
      console.log(str);
    });

    res.send({
      message: 'hello world. You should see me in your browser',
    });
  });

  app.get('/profile-picture/:name', (req, res) => {
    fs.stat(`files/${req.params.name}`, (err) => {
      if (err == null) {
        res.sendFile(path.join(`${rootDirectory}/files/${req.params.name}`));
      } else {
        console.log(`Error in file downloading route: ${err}`);
        res.sendFile(path.join(`${rootDirectory}/files/profile/defaultProfilePicture.jpg`));
      }
    });
  });
};
