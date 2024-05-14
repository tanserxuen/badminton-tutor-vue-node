// const { GoogleGenerativeAI } = require("google-generative-ai");
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/LEhh3auhv/";
let model, ctx, labelContainer, maxPredictions, webcam, cameraActivated = false;
let isGeneratingFeedback = false;
const fps = 5;

async function init() {
  cameraActivated = false;
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
  await webcam.play().then(() => {
    cameraActivated = true;
  });
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
  if (cameraActivated) {
    await predict();
    // setTimeout(() => {
    window.requestAnimationFrame(loop);
    // }, 1000 / fps);
    // console.log({ isGeneratingFeedback });
  }
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // check if user's whole body is in the frame
  if (JSON.stringify(pose?.keypoints)?.includes("0.0")) {
    drawPose(pose, false);
    return;
  }
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    console.log(prediction[i].probability.toFixed(2), prediction[i].className);
    if (prediction[i].probability.toFixed(2) > 0.75) document.getElementById("currentPose").innerHTML = prediction[i].className;
    // if (prediction[i].probability.toFixed(2) > 0.75 && prediction[i].className.includes('Big')) {
    //   document.getElementById("correctPostImage").src = "https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/Tutorials%2Ffront%20footwork%20right%20(26).jpg?alt=media&token=ba4d4ca7-993a-4ecf-b5cb-454b413838cd";
    // } else if (prediction[i].probability.toFixed(2) > 0.75 && prediction[i].className.includes('Squat')) {
    //   document.getElementById("correctPostImage").src = "https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/Tutorials%2Ffront%20footwork%20left%20(19).jpg?alt=media&token=5736c8a2-4453-4625-9fe5-6b2919541e2a";
    // } else if (prediction[i].probability.toFixed(2) > 0.75 && prediction[i].className.includes('Kick')) {
    //   document.getElementById("correctPostImage").src = "https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/Tutorials%2Fsideway%20footwork%20left%20(2).jpg?alt=media&token=589f39bc-adfc-4e45-97c3-413558186d0a";
    // }
  }
  if (isGeneratingFeedback == false) {
    isGeneratingFeedback = true;
    // generateFeedback(pose).then(() => {
    //   isGeneratingFeedback = false;
    //   console.log("Generating feedback done...");
    // });
  }

  // finally draw the poses
  drawPose(pose);
}

function drawPose(pose, hasFullBody = true) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    if (!hasFullBody) {
      ctx.font = "17px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("Full body not detected", 10, 80);
      return;
    }
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      console.log(JSON.stringify(pose.keypoints).replaceAll('"', "'"))
    }
  }
}

function clickStart(event) {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "block";
}
function clickCont(event) {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display =
    "none";
  document.getElementById("pauseButton").style.display = "block";
  document.getElementById("stopButton").style.display = "block";
  cameraActivated = true;
  webcam.play();
  loop();
}
function clickPause(event) {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display =
    "block";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  webcam.pause();
  cameraActivated = false;
}
function clickStop(event) {
  document.getElementById("startButton").style.display = "block";
  document.getElementById("continueButton").style.display =
    "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "none";
  webcam.stop();
  cameraActivated = false;
}

export {
  init,
  predict,
  clickStart,
  clickCont,
  clickPause,
  clickStop,
};
