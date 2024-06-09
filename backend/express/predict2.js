let rfmodel,
  ctx,
  labelContainer,
  webcam,
  cameraActivated = false,
  video,
  isGeneratingFeedback = false,
  tutorialJson,
  correctJson = null,
  predictionClass,
  probability,
  model,
  maxPredictions,
  net;
const fps = 5,
  movingAccuracyObj = {},
  minPartConfidence = 0.5,
  cameraMode = "environment",
  font = "16px sans-serif",
  publishable_key = "rf_XsVPXXU953d69Px5zICOOYiQ5Ch2",
  toLoad = {
    model: "badminton-pose-classification",
    version: 3,
  },
  URL = "https://teachablemachine.withgoogle.com/models/6_szoTmfF/";
var canvas, requestId;

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

const init = async () => {
  video = document.getElementById("video");
  Promise.all([startVideoStreamPromise(video), loadModelPromise]).then(
    function () {
      video.play()
      resizeCanvas();
      detectFrame();
    }
  );

  net = await posenet.load();

  console.log(canvas);
};

const startVideoStreamPromise = (video) =>
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: cameraMode,
      },
    })
    .then(function (stream) {
      return new Promise(function (resolve) {
        video.srcObject = stream;
        video.onloadeddata = function () {
          resolve(video);
        };
      });
    });

const loadModelPromise = new Promise(function (resolve, reject) {
  roboflow
    .auth({
      publishable_key: publishable_key,
    })
    .load(toLoad)
    .then(function (m) {
      rfmodel = m;
      resolve();
    });
});

function videoDimensions(video) {
  // Ratio of the video's intrisic dimensions
  var videoRatio = video.videoWidth / video.videoHeight;

  // The width and height of the video element
  var width = video.offsetWidth,
    height = video.offsetHeight;

  // The ratio of the element's width to its height
  var elementRatio = width / height;

  // If the video element is short and wide
  if (elementRatio > videoRatio) {
    width = height * videoRatio;
  } else {
    // It must be tall and thin, or exactly equal to the original ratio
    height = width / videoRatio;
  }

  return {
    width: width,
    height: height,
  };
}

window.onresize = function () {
  resizeCanvas();
};

const resizeCanvas = function () {
  canvas = document.getElementById("canvas");

  ctx = canvas.getContext("2d");

  var dimensions = videoDimensions(video);

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.setAttribute("width", dimensions.width);
  canvas.setAttribute("height", dimensions.height);
  canvas.setAttribute("left", (window.innerWidth - dimensions.width) / 2);
  canvas.setAttribute("top", (window.innerHeight - dimensions.height) / 2);
};

const renderPredictions = async function(predictions) {
  console.log(video);
  const flipHorizontal = true;

  // Scale the image. The smaller the faster
  const imageScaleFactor = 0.75;

  // Stride, the larger, the smaller the output, the faster
  const outputStride = 32;

  const pose = await net.estimateSinglePose(
    video,
    imageScaleFactor,
    flipHorizontal,
    outputStride
  );

  console.log({ pose });

  // roboflow output
  predictionClass = predictions[0].class;
  probability = predictions[0].confidence.toFixed(2);
  // await setMovingAccuracy(predictionClass, probability);
  // console.log({ correctPose, predictionClass });
  // await generateFeedback(correctPose, correctJson[predictionClass]);

  var dimensions = videoDimensions(video);

  var scale = 1;

  predictions.forEach(function(prediction) {
    const x = prediction.bbox.x;
    const y = prediction.bbox.y;

    const width = prediction.bbox.width;
    const height = prediction.bbox.height;

    // Draw the bounding box.
    ctx.strokeStyle = prediction.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(
      (x - width / 2) / scale,
      (y - height / 2) / scale,
      width / scale,
      height / scale
    );

    // Draw the label background.
    ctx.fillStyle = prediction.color;
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(
      (x - width / 2) / scale,
      (y - height / 2) / scale,
      textWidth + 8,
      textHeight + 4
    );
  });

  predictions.forEach(function(prediction) {
    const x = prediction.bbox.x;
    const y = prediction.bbox.y;

    const width = prediction.bbox.width;
    const height = prediction.bbox.height;

    // Draw the text last to ensure it's on top.
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillStyle = "#000000";
    ctx.fillText(
      prediction.class,
      (x - width / 2) / scale + 4,
      (y - height / 2) / scale + 1
    );
  });

  // cancelAnimationFrame(requestId);
};

var prevTime;
var pastFrameTimes = [];
const detectFrame = function () {
  if (!rfmodel) return loop();

  rfmodel
    .detect(video)
    .then(function (predictions) {
      loop(predictions);

      if (prevTime) {
        pastFrameTimes.push(Date.now() - prevTime);
        if (pastFrameTimes.length > 30) pastFrameTimes.shift();

        var total = 0;
        _.each(pastFrameTimes, function (t) {
          total += t / 1000;
        });

        var fps = pastFrameTimes.length / total;
        document.getElementById("fps").innerText = Math.round(fps);
      }
      prevTime = Date.now();
    })
    .catch(function (e) {
      console.log("CAUGHT", e);
      loop();
    });
};

function loop(predictions = null) {
  // To sync the video in canvas with the video element
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  if (!predictions || !predictions.length) {
    requestId = requestAnimationFrame(detectFrame);
    return;
  }
  renderPredictions(predictions);
  requestId = requestAnimationFrame(detectFrame);
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
  // cameraActivated = true;
  // webcam.play();
  loop();
}

function clickPause(event) {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  // webcam.pause();
  // cameraActivated = false;
  cancelAnimationFrame(requestId);
}

function clickStop(event) {
  document.getElementById("startButton").style.display = "block";
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "none";
  // webcam.stop();
  // cameraActivated = false;
  cancelAnimationFrame(requestId);
}

function setMovingAccuracy(className, probability) {
  movingAccuracyObj[className]?.length
    ? movingAccuracyObj[className].push(probability)
    : (movingAccuracyObj[className] = [probability]);
  const clone = { ...movingAccuracyObj };
  console.log({ clone });
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
  // window.location.href = "http://localhost:8080/dashboard";
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
  // predict,
  clickStart,
  clickCont,
  clickPause,
  clickStop,
  calculateMovingAccuracy,
  backToApp,
};
