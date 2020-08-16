const dcp = require('dcp-client');
const tf = require('@tensorflow/tfjs');
let globalJob;
let globalInput;

async function main() {
  // these have to be here
  const compute = require('dcp/compute');
  const wallet  = require('dcp/wallet');

  let job, startTime;

  job = compute.for(globalInput, globalJob);
  /*job = compute.for([globalInput], async function(globalInput) {
     // Unpack the input
     let tensorImg = globalInput.data;
     let modelSerial = globalInput.model;

     var tf = require('tfjs');

     // Load model
     const model = await tf.loadModel(tf.io.fromMemory(modelSerial[0].modelTopology,
      modelSerial[0].weightSpecs, modelSerialized[0].weightData));

    // Classify image
    const predicitons = await model.classify(tensorImg);
    console.log("Predictions:\n", predictions);
    return predictions;
  });*/

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
  })

  job.public.name = 'GUNK Gunkstribute';
  job.public.description = 'Object detection using distributed computing, from Team Gunk';
  job.requires('aistensorflow/tfjs');

  let ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);
  await job.localExec();
}

function runJob(job, input) {
  globalJob = job;
  globalInput = input;

  dcp.init().then(main).finally(() => {
    
    setImmediate(process.exit);
    return 'hello';
  });
}

function runRafaelJob(job, model, input) {
  globalJob = job;
  globalInput = [input, model]
  //globalInput = {data: input, model: model};

  dcp.init().then(main).finally(() => {
    setImmediate(process.exit);
    return 'hello';
  });
}

// this exports these functions as public functions
module.exports = {
  runJob,
  runRafaelJob,
};