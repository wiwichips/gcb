// const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
// const stat = promisify(fs.stat);


async function classifyImage(img) {
  
  
  // Load the model.
  const model = await mobilenet.load();

  // Classify the image.
  const predictions = await model.classify(img);

  console.log('Predictions: ');
  console.log(predictions);

  return 'hello world';
}

module.exports = {
  classifyImage,
};
