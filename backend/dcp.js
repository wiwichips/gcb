const dcp = require('dcp-client');
let globalJob;
let globalInput;
let globalModel;

async function main() {
  // these have to be here
  const compute = require('dcp/compute');
  const wallet  = require('dcp/wallet');

  let job, startTime;

  job = compute.for(globalInput, globalJob);

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

  job.public.name = 'GUNK Gunstribute';
  job.public.description = 'Object detection using distributed computing, from Team Gunk';

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
  globalInput = [input, model];

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