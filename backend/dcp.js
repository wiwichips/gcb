const dcp = require('dcp-client');

let globalJob;
let globalInput;
var THE_RESULT;

async function main() {
  // these have to be here
  const compute = require('dcp/compute');
  const wallet  = require('dcp/wallet');

  let job, startTime;

  // job = compute.for(globalInput, async (imageTensor) => {
  //   console.log('please!!!!!c     !!!!!!!!!c     !!!!!!!!!!!!c     !!!!!!!!!!');
  //   var tf = require('tfjs');
  //   // var mobileNet = require('./mobilenet_bundled.js');
  //   tf.setBackend('webgl');    
  //   mobileNet = require('mobilenet');

  //   // get the model
  //   console.log('\nget the model');
  //   let model = await mobileNet.getModel();
  //   console.log('model has been got');

  //   // make predictions
  //   console.log('make predictions');
  //   console.log(model);
  //   const predictions = await model.classify(imageTensor);
  //   console.log('predictions have been gotten');
  //   console.log(predictions);
  //   return predictions;
  // });

  job = compute.for([globalInput], async function(sliceInfo){
    //class information 



    let imageData = sliceInfo.data;
    let imageShape = sliceInfo.shape;
    let imageNetClasses = JSON.parse(sliceInfo.classes);
    progress(0.01); 
    var tf = require('tfjs');
    tf.setBackend('webgl');
    var { getModel } = require('mobilenet');

    let imageTensor = tf.tensor(imageData, imageShape, 'int32').expandDims(0);
      
    imageTensor = tf.image.resizeBilinear(imageTensor, [224,224], true);
    
    imageTensor = imageTensor.div(255).mul(2).sub(1);

    progress(0.5);
    console.log(tf.version);
    let model = await getModel();

    progress(0.6);
    const result = await model.predict( imageTensor );
    const bestInd = tf.argMax(tf.squeeze(result)).dataSync()[0];

    const pred = imageNetClasses[bestInd.toString()];

    console.log(pred);

    return pred;
  });

  job.on('accepted', (ev) => {
    console.log(`Job accepted by scheduler -> this.id = ${this.id}\n\n`);
    startTime = Date.now();
  })

  job.on('complete', (ev) => {
    console.log(`\t\tJob Finished, total runtime = ${Math.round((Date.now() - startTime) / 100)/10}s`);
  })

  job.on('readystatechange', (arg) => {
    console.log(`\t\tnew ready state: ${arg}`);
  })

  job.on('status', (update) => {console.log(update)});

  job.on('console', (message) => { 
    console.log('console.log = ');
    console.log(message);
    console.log('\n');
  });
  
  job.on('result', (ev) => {
    console.log(`COLOUR = ${ev.result} -> \tReceived result for slice ${ev.sliceNumber} at ${Math.round((Date.now() - startTime) / 100)/10}s`);
    console.log(ev.result);
    console.log(ev);
    console.log(ev.result);
    console.log("\n\n\n\n\n\n");
    THE_RESULT = ev.result;
  })

  job.requires('aistensorflow/tfjs');
  job.requires('mobilenetv2/mobilenet');

  job.public.name = 'events example, nodejs';
  job.public.description = 'DCP-Client Example examples/node/events.js';

  let ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);
  await job.exec();
}

async function runJob(inputs) {
  globalInput = inputs;

  // initialize the dcp
  console.log('\n\tInitializing DCP\t~~~~~~~~~');
  const init = await dcp.init();

  // run the job
  console.log('\n\tRunning the job\t\t~~~~~~~~~');
  const jobValue = await main(init);
  // console.log(jobValue);
  // console.log(jobValue);
  // console.log(jobValue);
  // console.log(jobValue);
  // console.log(jobValue);
  // console.log(jobValue);

  // end the process
  console.log('\n\tending the process DCP\t~~~~~~~~~');
  await setImmediate(process.exit);

  return THE_RESULT;
}

// this exports these functions as public functions
module.exports = {
  runJob,
};