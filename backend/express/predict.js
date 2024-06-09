const URL = "https://teachablemachine.withgoogle.com/models/6_szoTmfF/"; // technique 3
// const URL = "https://teachablemachine.withgoogle.com/models/LEhh3auhv/"; // technique 2
// const URL = "https://teachablemachine.withgoogle.com/models/LEhh3auhv/"; // technique 1

let model,
  ctx,
  labelContainer,
  maxPredictions,
  webcam,
  cameraActivated = false;
let isGeneratingFeedback = false,
  tutorialJson,
  correctJson = null;
const fps = 5,
  movingAccuracyObj = {};
const minPartConfidence = 0.5;

axios({
  method: "get",
  url: "/api/tutorials/",
})
  .then(({ data }) => {
    tutorialJson = { ...data[0].techniques, ...data[0].footwork };
  })
  .catch((error) => {
    console.log("error: ", error);
  });

axios({
  method: "get",
  url: "/json/correctJson.json",
})
  .then(({ data }) => (correctJson = data))
  .catch((error) => {
    console.log("error: ", error);
  });

window.addEventListener("beforeunload", async function (e) {
  e.preventDefault();
  console.log("beforeunload");
  beforeLeavePage();
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
  const size = 400;
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
    window.requestAnimationFrame(loop);
    console.log({ isGeneratingFeedback });
  }
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);

  // check if user's whole body is in the frame
  if (JSON.stringify(pose?.keypoints)?.includes("0.0") && pose) {
    drawPose(pose, false);
    return;
  }

  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);
  let correctPoseClassName = null;

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    // if the class's probability is the highest of all class

    const highestProbability = Math.max(
      ...prediction.map((p) => p.probability)
    );

    if (
      prediction[i].probability == highestProbability &&
      highestProbability > 0.75
    ) {
      correctPoseClassName = prediction[i].className;
      document.getElementById("currentPose").innerHTML = correctPoseClassName;
      // display relavant tutorial based on the detected pose
      document.getElementById("correctPostImage").src =
        tutorialJson[correctPoseClassName.replaceAll(" ", "-")]?.image;

      // only record the highest probability of the detected pose
      setTimeout(async () => {
        await setMovingAccuracy(
          correctPoseClassName,
          prediction[i].probability.toFixed(2)
        );
      }, 1500);
    }
  }

  // return if no pose detected
  if (
    isGeneratingFeedback &&
    JSON.stringify(pose?.keypoints)?.includes("0.0") &&
    !pose
  )
    return;

  isGeneratingFeedback = true;

  try {
    generateFeedback(pose, correctJson[correctPoseClassName]).then(() => {
      isGeneratingFeedback = false;
      console.log("Generating feedback done...");
    });
  } catch (e) {
    console.log("Error: ", e);
    isGeneratingFeedback = false;
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
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
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
  const averageAccuracy = Object.keys(movingAccuracyObj).reduce((acc, key) => {
    const average =
      movingAccuracyObj[key].reduce((acc, val) => acc + parseFloat(val), 0) /
      movingAccuracyObj[key].length;
    acc[key] = average;
    return acc;
  }, {});
  return averageAccuracy;
}

async function updateAnalytics(averageAccuracy) {
  console.log("updating analytics...");
  console.log({ averageAccuracy });
  await axios({
    method: "post",
    url: "/api/analytics/update-movement-accuracy",
    data: {
      movingAccuracyObj,
      latestAverageAccuracy: averageAccuracy,
    },
  })
    .then((response) => {
      console.log("fetch tutorial data: ", response.data);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

async function backToApp() {
  await beforeLeavePage();
  window.location.href = "http://localhost:8080/dashboard";
}

async function beforeLeavePage() {
  const res = confirm("You are leaving the page");
  //if yes continue leave page, else stay on the page
  if (res) {
    await updateAnalytics(await calculateMovingAccuracy());
    return "Goodbye!";
  } else {
    return "Stay on the page!";
  }
}

export {
  init,
  predict,
  clickStart,
  clickCont,
  clickPause,
  clickStop,
  calculateMovingAccuracy,
  backToApp,
};
