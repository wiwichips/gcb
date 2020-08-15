const tf = require('@tensorflow/tfjs');
// const tfn = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const imageGet = require('get-image-data');
// const stat = promisify(fs.stat);

async function loadLocalImage(filename) {
  return new Promise((res,rej) => {
    imageGet(filename, (err, info) => {
      if(err){
        rej(err);
        return;
      }

      const image = tf.browser.fromPixels(info);
      console.log(image, '127');
      res(image);
    });
  });
}

async function classifyImage(img) {
  tf.setBackend('cpu');

  // image data
  const imgData = await loadLocalImage(img);
  
  // Load the model.
  const model = await mobilenet.load();

  // Classify the image.
  const predictions = await model.classify(imgData);

  console.log('Predictions: ');
  console.log(predictions);

  return 'hello world';
}

module.exports = {
  classifyImage,
};
