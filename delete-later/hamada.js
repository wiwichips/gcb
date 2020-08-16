const fs      = require('fs');
const tf      = require('@tensorflow/tfjs');
const tfn     = require('@tensorflow/tfjs-node');

async function main(){
  var imgFile = fs.readFileSync('./img2.jpeg');
  var imageTensor = tfn.node.decodeJpeg(imgFile, 3);
  var sliceData = {
    data: imageTensor.arraySync(),
    shape: imageTensor.shape
  }; 

  await require('dcp-client').init(process.argv);

  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');
  const dcpCli = require('dcp/dcp-cli');

  const argv = dcpCli.base([
    '\x1b[33mThis application is for testing.\x1b[37m'
  ].join('\n')).argv;
  
  const identityKeystore = await dcpCli.getIdentityKeystore();
  wallet.addId(identityKeystore);

  const accountKeystore = await dcpCli.getAccountKeystore();

  console.log("Loaded Keystore");
  
  var job = compute.for([sliceData], async function(sliceInfo){
    //class information
    coco_id_mapping = {
      1: 'person', 2: 'bicycle', 3: 'car', 4: 'motorcycle', 5: 'airplane',
      6: 'bus', 7: 'train', 8: 'truck', 9: 'boat', 10: 'traffic light',
      11: 'fire hydrant', 13: 'stop sign', 14: 'parking meter', 15: 'bench',
      16: 'bird', 17: 'cat', 18: 'dog', 19: 'horse', 20: 'sheep', 21: 'cow',
      22: 'elephant', 23: 'bear', 24: 'zebra', 25: 'giraffe', 27: 'backpack',
      28: 'umbrella', 31: 'handbag', 32: 'tie', 33: 'suitcase', 34: 'frisbee',
      35: 'skis', 36: 'snowboard', 37: 'sports ball', 38: 'kite',
      39: 'baseball bat', 40: 'baseball glove', 41: 'skateboard', 42: 'surfboard',
      43: 'tennis racket', 44: 'bottle', 46: 'wine glass', 47: 'cup', 48: 'fork',
      49: 'knife', 50: 'spoon', 51: 'bowl', 52: 'banana', 53: 'apple',
      54: 'sandwich', 55: 'orange', 56: 'broccoli', 57: 'carrot', 58: 'hot dog',
      59: 'pizza', 60: 'donut', 61: 'cake', 62: 'chair', 63: 'couch',
      64: 'potted plant', 65: 'bed', 67: 'dining table', 70: 'toilet', 72: 'tv',
      73: 'laptop', 74: 'mouse', 75: 'remote', 76: 'keyboard', 77: 'cell phone',
      78: 'microwave', 79: 'oven', 80: 'toaster', 81: 'sink', 82: 'refrigerator',
      84: 'book', 85: 'clock', 86: 'vase', 87: 'scissors', 88: 'teddy bear',
      89: 'hair drier', 90: 'toothbrush',
    }



    let imageData = sliceInfo.data;
    let imageShape = sliceInfo.shape;
    progress(0.01); 
    var tf = require('tfjs');
    tf.setBackend('webgl');
    var { getModel } = require('efficientDetD0');

    let imageTensor = tf.tensor(imageData, imageShape, 'int32').expandDims(0);
      
    imageTensor = tf.image.resizeBilinear(imageTensor, [416,416], true);
    
    imageTensor = tf.cast(imageTensor, 'int32');

    progress(0.5);
    console.log(tf.version);
    let model = await getModel();

    progress(0.6);
    const result = await model.executeAsync({'image_arrays:0': imageTensor }, ['detections:0']);
    progress(0.7);
    console.log(result);
    const bounding_boxes = result.arraySync()[0];
    let finalBoxes = [];
    for (let i=0; i< bounding_boxes.length;i++){
      if (bounding_boxes[i][5] > 0.3){
        let box = {
          conf: bounding_boxes[i][5],
          class: coco_id_mapping[bounding_boxes[i][6]],
          box: [bounding_boxes[i][1], bounding_boxes[i][2], bounding_boxes[i][3], bounding_boxes[i][4]]
        };
        finalBoxes.push(box);
      }
    }
    console.log(finalBoxes);
    progress(1.0);
    return finalBoxes;   
  });

  console.log('Deploying Job!');

  //set webgl compute requirement
  job.requirements.environment.offscreenCanvas = true;


  job.on('accepted', ()=>{
    console.log('Job accepted....');
  });

  job.on('status', (status)=>{
    console.log('Got a status update: ', status);
  });

  job.on('result', (value) =>{
    console.log('Got a result: ', value.result);
  });

  job.on('console', (Output) => {
    console.log(Output.message);
  });

  job.on('error', (err)=>{
    console.log(err);
  });

  job.on('uncaughException', (Output) =>{
    console.log(Output);
  });

  job.requires('aistensorflow/tfjs');
  job.requires('aitf-test/efficientDetD0')
  job.public.name = 'DCP-tfjs_utils-Test';
  await job.exec(compute.marketValue, accountKeystore);

  console.log("Done!");

};




main().then( ()=> process.exit(0)).catch(e=>{console.error(e);;process.exit(1)});
