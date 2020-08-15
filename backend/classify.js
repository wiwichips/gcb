const bodyParser = require('body-parser');
const dcpJob = require('./dcp.js');

// these are the routes that are exported to app.js
exports.setApp = (app) => {
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


};
