const bodyParser = require('body-parser');

const dcpJob = require('./dcp.js');
const classify = require('./classify.js');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
// const tf = require('tensorflow/tfjs');

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
    const imgString = path.join(`${rootDirectory}/tartar.jpeg`);
    classify.classifyImage(imgString).then((str) => {
      console.log(str);
    });

    res.send({
      message: imgString,
    });
  });

  // would not need this, just have it as an example
  app.get('/pic/:name', (req, res) => {
    fs.stat(`${rootDirectory}/${req.params.name}`, (err) => {
      if (err == null) {
        console.log(req.params.name);        
        res.sendFile(path.join(`${rootDirectory}/${req.params.name}`));
      } else {
        console.log(`Error in file downloading route: ${err}`);
        res.sendFile(path.join(`${rootDirectory}/tartar.jpeg`));
      }
    });
  });

  // Respond to POST requests that a file has been uploaded to the 
  // backend/files/ directory
  app.post('/upload', function(req, res) {
    // If nothing was uploaded
    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    }

    console.log(req.files);
    let uploadedFile = req.files.uploadFile;

    //  Move the uploaded file to the backend/files directory
    uploadedFile.mv('backend/files/' + uploadedFile.name, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
    });
  });

  // Respond to GET request to classify an image
  app.get('/classify', function(req, res) {
    console.log(`got here: ${req.query.filename}`);
    let fn = req.query.filename;

    classify.classyify("./backend/files/" + fn)
      .then((result) => {res.send(result)});
    //TODO: Return the classification results to browser
    //TODO: Move these functions elsewhere(?)
  });

  // Respond to GET request to classify an image
  app.get('/classifytar', function(req, res) {
    console.log(`got here: ${req.query.filename}`);
    let fn = req.query.filename;

    const files = ["./backend/files/tartar.jpeg", "./backend/files/images.jpeg"];

    const imageTensors = files.map((str) => classify.getImageAsTensor(str));

    dcpJob.runJob(imageTensors).then((res) => {
      console.log('\n\nRESULTS - should print mobilenet');
      console.log(res);
    });

    
      // .then((result) => {res.send(result)});
    //TODO: Return the classification results to browser
    //TODO: Move these functions elsewhere(?)
  });

  app.get('/test-save', function(req, res) {
    classify.getModel().then((result) => {
      console.log(result);
    });
  });
};
