// const { GoogleGenerativeAI } = require("google-generative-ai");
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose
// the link to your model provided by Teachable Machine export panel

const URL = "https://teachablemachine.withgoogle.com/models/6_szoTmfF/"; // technique 3
// const URL = "https://teachablemachine.withgoogle.com/models/LEhh3auhv/"; // technique 2
// const URL = "https://teachablemachine.withgoogle.com/models/LEhh3auhv/"; // technique 1
let model,
  ctx,
  labelContainer,
  maxPredictions,
  webcam,
  cameraActivated = false;
let isGeneratingFeedback = false;
const fps = 5;
let tutorialJson = null;

axios({
  method: "get",
  url: "http://localhost:3000/tutorials/",
})
  .then(({ data }) => {
    tutorialJson = { ...data.techniques, ...data.footwork };
    console.log({ tutorialJson });
  })
  .catch((error) => {
    console.log("error: ", error);
  });

const movingAccuracyObj = {};

window.addEventListener("beforeunload", async function (e) {
  e.preventDefault();
  console.log("beforeunload");
  await updateAnalytics(await calculateMovingAccuracy());
  const res = alert("You are leaving the page");
  //if yes continue leave page, else stay on the page
  if (res) {
    return "Goodbye!";
  } else {
    return "Stay on the page!";
  }
});

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
    // if the class's probability is the highest of all class
    console.log("max: ", Math.max(...prediction.map((p) => p.probability)));
    
    const highestProbability = Math.max(
      ...prediction.map((p) => p.probability)
    );
    
    if (
      prediction[i].probability == highestProbability &&
      highestProbability > 0.75
    ) {
      document.getElementById("currentPose").innerHTML =
        prediction[i].className;
      // display relavant tutorial based on the detected pose
      document.getElementById("correctPostImage").src =
        tutorialJson[prediction[i].className.replaceAll(" ", "-")]?.image;

      // only record the highest probability of the detected pose
      setTimeout(async () => {
        await setMovingAccuracy(
          prediction[i].className,
          prediction[i].probability.toFixed(2)
        );
      }, 1500);
    }
  }
  if (isGeneratingFeedback == false) {
    isGeneratingFeedback = true;
    // to uncomment
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
      console.log(JSON.stringify(pose.keypoints).replaceAll('"', "'"));
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
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "block";
  document.getElementById("stopButton").style.display = "block";
  cameraActivated = true;
  webcam.play();
  loop();
}

function clickPause(event) {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  webcam.pause();
  cameraActivated = false;
}

function clickStop(event) {
  document.getElementById("startButton").style.display = "block";
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "none";
  webcam.stop();
  cameraActivated = false;
}

function setMovingAccuracy(className, probability) {
  const newClassName = className.replaceAll(" ", "-");
  movingAccuracyObj[newClassName]?.length
    ? movingAccuracyObj[newClassName].push(probability)
    : (movingAccuracyObj[newClassName] = [probability]);
  console.log({ movingAccuracyObj });
}

function calculateMovingAccuracy() {
  //get average accuracy for each key in the object movingAccuracyObj and display in a object
  const averageAccuracy = Object.keys(movingAccuracyObj).reduce(
    (acc, key) => {
      const average =
        movingAccuracyObj[key].reduce((acc, val) => acc + parseFloat(val), 0) /
        movingAccuracyObj[key].length;
      acc[key] = average;
      return acc;
    },
    {}
  );
  return averageAccuracy;
}

async function updateAnalytics(averageAccuracy) {
  console.log("updating analytics...");
  console.log({ averageAccuracy });
  await axios({
    method: 'post',
    url: "http://localhost:3000/analytics/update-movement-accuracy",
    data: {
      movingAccuracyObj, 
      "latestAverageAccuracy": averageAccuracy
    }
  }).then((response) => {
    console.log("fetch tutorial data: ", response.data);
  }).catch((error) => {
    console.log("error: ", error);
  });
}

export { init, predict, clickStart, clickCont, clickPause, clickStop, calculateMovingAccuracy };
