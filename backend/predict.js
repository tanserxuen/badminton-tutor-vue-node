// const { GoogleGenerativeAI } = require("google-generative-ai");
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "model/";
let model, webcam, ctx, labelContainer, maxPredictions;
let isGeneratingFeedback = false;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const size = 200;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById("canvas");
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext("2d");
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
  console.log({ isGeneratingFeedback });
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }

  // finally draw the poses
  drawPose(pose);
  if (isGeneratingFeedback == false) {
    isGeneratingFeedback = true;
    generateFeedback(pose).then(() => {
      isGeneratingFeedback = false;
      console.log("Generating feedback done...");
    });
  }
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}

// async function generateFeedback(pose) {
// const incorrectJson = JSON.stringify(pose);
// const correctJson = JSON.stringify([{"score":0.8947370648384094,"part":"nose","position":{"x":234.28646599736194,"y":175.96719237153167}},{"score":0.8832026720046997,"part":"leftEye","position":{"x":239.6100652820869,"y":169.8886773001823}},{"score":0.5662047266960144,"part":"rightEye","position":{"x":235.95281148235156,"y":170.1057300493411}},{"score":0.9042125940322876,"part":"leftEar","position":{"x":253.15143254944323,"y":169.89184075292445}},{"score":0.11866213381290436,"part":"rightEar","position":{"x":230.25205070406545,"y":170.52088822836077}},{"score":0.9879465699195862,"part":"leftShoulder","position":{"x":269.36060816397463,"y":200.0307489461936}},{"score":0.9413213729858398,"part":"rightShoulder","position":{"x":237.268412623424,"y":199.75937479664844}},{"score":0.9791402816772461,"part":"leftElbow","position":{"x":289.0813378508453,"y":238.33601762348576}},{"score":0.8448910117149353,"part":"rightElbow","position":{"x":228.18234922357107,"y":231.06244380372044}},{"score":0.7894282341003418,"part":"leftWrist","position":{"x":261.1234744699085,"y":242.09491288151722}},{"score":0.847267210483551,"part":"rightWrist","position":{"x":232.83399125481392,"y":238.18936793256827}},{"score":0.9825746417045593,"part":"leftHip","position":{"x":292.47121402725634,"y":265.18915321112604}},{"score":0.8880601525306702,"part":"rightHip","position":{"x":260.35651158729877,"y":269.2972862303025}},{"score":0.978084146976471,"part":"leftKnee","position":{"x":290.6379430674393,"y":320.1855741122353}},{"score":0.9329531192779541,"part":"rightKnee","position":{"x":284.79714569878485,"y":321.18942208791054}},{"score":0.9069610834121704,"part":"leftAnkle","position":{"x":304.89546547603976,"y":373.43037962652596}},{"score":0.8557844161987305,"part":"rightAnkle","position":{"x":289.11574526983475,"y":369.35585667650986}}]);
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// const prompt = `provided the correct pose's coordinates: ${correctJson}. provided the incorrect pose's coordinates: ${incorrectJson}. Teach and instruct the person with incorrect pose to adjust his body in 3 sentence. you dont have to show the adjusted arrays`

// const result = await model.generateContent(prompt);
// const response = await result.response;
// const feedback = response.text();
// console.log({feedback})
// }

// module.exports = {
//   init,
//   predict,
//   generateFeedback
// };

export { init, predict };
