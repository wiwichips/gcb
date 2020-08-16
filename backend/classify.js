const bodyParser = require('body-parser');

const dcpJob = require('./dcp.js');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

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

function getImageAsTensor(path) {
  const image = readImage(path);
  const input = imageToInput(image, 3);
  return input
}

const loadAndSerializeModel = async() => {
    // Load model
    const model = await mobilenet.load();
  
    // Serialize the model
    const artifactsArray = [];
    await model.save(tf.io.withSaveHandler(artifacts => {
      artifactsArray.push(artifacts);
    }));

    return artifactsArray;
}


const classyify = async (path) => {
  const image = readImage(path);
  const input = imageToInput(image, 3);

  // Load model
  const model = await mobilenet.load();

  // Classify image
  const predictions = await model.classify(input);
  console.log("Predictions:\n", predictions);
  return predictions;tumb
}

const classyifyRafael = async (tensorImg, modelSerialized) => {
  // Unpack array
  let tensorImg = input[0];
  let modelSerialized = input[1];

  // Load model from memory
  const model = await tf.loadModel(tf.io.fromMemory(
    modelSerialized[0].modelTopology, modelSerialized[0].weightSpecs,
    artifactsArray[0].weightData));

  // Classify image
  const predictions = await model.classify(tensorImg);
  console.log("Predictions:\n", predictions);
  return predictions;
}

// clsasyify3 expects image tensor from getImageAsTensor
const classyify3 = async (imgtensor) => {

  const input = imgtensor;

  // Load model
  const model = await mobilenet.load();

  // Classify image
  const predictions = await model.classify(input);
  console.log("Predictions:\n", predictions);
  return predictions;
}

module.exports = {
  readImage,
  classyify,
  getImageAsTensor,
  classyify3,
  loadAndSerializeModel,
  classyifyRafael,
}