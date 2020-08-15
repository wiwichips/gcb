const dcp = require('dcp-client');
var ARR = [];

async function main() {
  // these have to be here
  const compute = require('dcp/compute');
  const wallet  = require('dcp/wallet');

  let job, startTime;

  colours = ["red", "green", "yellow", "blue", "brown", "orange", "pink"];

  job = compute.for(ARR, (colour) => {
    progress();
    const string = colour.split("").reverse().join("");
    return string;
  });

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

  job.public.name = 'events example, nodejs';
  job.public.description = 'DCP-Client Example examples/node/events.js';

  let ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);
  await job.localExec();
}

function runJob() {
  dcp.init().then(main).finally(() => setImmediate(process.exit));
}

function runJobNewInput() {
  const prompt = require('prompt-sync')();

  // Get numbers from the user
  for (i = 0; i < 5; i++) {
      ARR[i] = prompt(`Enter word #${i}: `);
  }
  
  runJob();  
}

// this exports these functions as public functions
module.exports = {
  runJob, runJobNewInput,
};
