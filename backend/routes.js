const bodyParser = require('body-parser');

const dcpJob = require('./dcp.js');
const classify = require('./classify.js');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

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

    classyify("./backend/files/" + fn)
      .then((result) => {res.send(result)});
    //TODO: Return the classification results to browser
    //TODO: Move these functions elsewhere(?)
  });
};

// The following functions are for the categorization of the image
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node');
const jpeg = require('jpeg-js');

const readImage = path => {
  const buf = fs.readFileSync(path);
  const pixels = jpeg.decode(buf, true);
  return pixels;
}

const imageByteArray = (image, numChannels) => {
  const pixels = image.data;
  const numPixels =image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (var i = 0; i < numPixels; i++) {
    for (var chan = 0; chan < numChannels; ++chan) {
      values[i * numChannels + chan] = pixels[i * 4 + chan];
    }
  }

  return values;
}

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels);
  const outShape = [image.height, image.width, numChannels];
  const input = tf.tensor3d(values, outShape, 'int32');

  return input;
}

const classyify = async (path) => {
  const image = readImage(path);
  const input = imageToInput(image, 3);

  // Load model
  const model = await mobilenet.load();

  // Classify image
  const predictions = await model.classify(input);
  console.log("Predictions:\n", predictions);
  return predictions;
}
