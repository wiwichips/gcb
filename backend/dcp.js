const dcp = require('dcp-client');

let globalJob;
let globalInput;

async function main() {
  // these have to be here
  const compute = require('dcp/compute');
  const wallet  = require('dcp/wallet');

  let job, startTime;

  job = compute.for(globalInput, async (imageTensor) => {
    var tf = require('tfjs');
    var mobileNet = require('./mobilenet_bundled.js');
    tf.setBackend('webgl');

    // progress(0.5);
    progress(0.5);

    // get the model
    let model = await mobileNet.getModel();

    // make predictions
    const predictions = await model.classify(imageTensor);
    return predictions;
  });

  // job require tensorflow 
  job.requires('aistensorflow/tfjs');
  job.requires('./mobilenet_bundled.js');

  job.on('accepted', (ev) => {
    console.log(`o_o -> Job accepted by scheduler -> Job has id ${this.id}\n\n`);
    startTime = Date.now();
  })

  job.on('complete', (ev) => {
    console.log(`\t\tJob Finished, total runtime = ${Math.round((Date.now() - startTime) / 100)/10}s`);
  })

  job.on('readystatechange', (arg) => {
    console.log(`\t\tnew ready state: ${arg}`);
  })
  
  job.on('result', (ev) => {
    console.log(`COLOUR = ${ev.result} -> \tReceived result for slice ${ev.sliceNumber} at ${Math.round((Date.now() - startTime) / 100)/10}s`);
    console.log(ev.result);
    console.log("\n\n\n\n\n\n");
  })

  job.public.name = 'events example, nodejs';
  job.public.description = 'DCP-Client Example examples/node/events.js';

  let ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);
  await job.localExec();
}

async function runJob(inputs) {
  globalInput = inputs;

  // initialize the dcp
  console.log('\n\tInitializing DCP\t~~~~~~~~~');
  const init = await dcp.init();

  // run the job
  console.log('\n\tRunning the job\t\t~~~~~~~~~');
  const jobValue = await main(init);

  // end the process
  console.log('\n\tending the process DCP\t~~~~~~~~~');
  await setImmediate(process.exit);

  return jobValue;
}

// this exports these functions as public functions
module.exports = {
  runJob,
};