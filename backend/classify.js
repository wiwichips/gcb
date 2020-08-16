const bodyParser = require('body-parser');

const dcpJob = require('./dcp.js');
const fs = require('fs');
// const path = require('path');
const { fileURLToPath } = require('url');
require('@tensorflow/tfjs-node');

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

// clsasyify3 expects image tensor from getImageAsTensor
const classyify3 =  (obj) => {

  const mobnet = obj.mod;
  const input = obj.tensorImage;

  progress();

  return mobnet;

  // Load model
  // const model = await mobnet.load();
  // console.log(mobnet);

  // // Classify image
  // const predictions = await model.classify(input);
  // console.log("Predictions:\n", predictions);
  // return predictions;
}


async function getModel2() {
  const model = await mobilenet.load();

  const artifactsArray = model.model.artifacts;

  // console.log(artifactsArray);
  console.log(model.model.artifacts);

  console.log(model2);

  return artifactsArray;
}



async function getModel() {
  const model = await mobilenet.load();

  const artifactsArray = [];

  // First save, before training.
  await model.save(tf.io.withSaveHandler(artifacts => {
    artifactsArray.push(artifacts);
  }));

  // First load.
  const model2 = await tf.loadModel(tf.io.fromMemory(
      artifactsArray[0].modelTopology, artifactsArray[0].weightSpecs,
      artifactsArray[0].weightData));

  // Do some training.
  await model.fit(xs, ys, {epochs: 5});

  // Second save, before training.
  await model.save(tf.io.withSaveHandler(artifacts => {
    artifactsArray.push(artifacts);
  }));

  // Second load.
  const model3 = await tf.loadModel(tf.io.fromMemory(
      artifactsArray[1].modelTopology, artifactsArray[1].weightSpecs,
      artifactsArray[1].weightData));

  // The two loaded models should have different weight values.
  model2.getWeights()[0].print();
  model3.getWeights()[0].print();
};

async function getInputList(strings) {
  let inputs = [];
  for (i = 0; i < strings.length; i++) {
    const modelUrl =
     'https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/2';
    const model = await tf.loadGraphModel(modelUrl, {fromTFHub: true})
    const obj = { mod: model, tensorImage: getImageAsTensor(strings[i]) };
    inputs.push(obj);
  }

  return inputs;
}



module.exports = {
  readImage,
  classyify,
  getImageAsTensor,
  classyify3,
  getModel,
  getInputList,
}
