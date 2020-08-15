const img = document.getElementById('img');

// Load the model.
mobilenet.load().then(model => {
  // Classify the image.
  model.classify(img).then(predictions => {
    console.log('Predictions: ');
    console.log(predictions);
  });
});

console.log('hello world');