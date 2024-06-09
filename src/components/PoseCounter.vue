<template>
  <div class="container mx-auto px-4 py-10">
    <h2 class="base-page__heading-short">
      <span>Feedbacks</span>
    </h2>
    <div class="base-page__inner-margin">
      <!-- <button id="updateDBButton">updateAccuracyDB</button> -->
      <small id="msg"></small><br />
      <small>Make sure your full body is in the camera</small><br />

      <div class="flex">
        <button type="button" id="startButton" @click="init(); clickStart();" class="mt-10 mr-3">
          <i class="fas fa-circle-play fa-3x"></i>
        </button>
        <button type="button" style="display: none" id="continueButton" @click="clickCont" class="mt-10 mr-3">
          <i class="fas fa-circle-play fa-3x"></i>
        </button>
        <button type="button" style="display: none" id="pauseButton" @click="clickPause" class="mt-10 mr-3">
          <i class="fas fa-circle-pause fa-3x"></i>
        </button>
        <button type="button" style="display: none" id="stopButton" @click="clickStop" class="mt-10 mr-3">
          <i class="fas fa-3x fa-circle-stop"></i>
        </button>
      </div>

      <div class="flex flex-row gap-x-16 mt-10">
        <canvas id="canvas"></canvas>
        <img id="correctPostImage" src="https://placehold.co/350x220" alt="" />
        <h1 id="currentPose" class="text-6xl"></h1>
      </div>
      <div id="label-container"></div>
      <ol id="feedbacks"></ol>
    </div>
  </div>
</template>

<script setup>
// import axios from 'axios';
// import roboflow from "@roboflow/roboflow-js";
// import { onMounted, ref } from 'vue';
// // import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// const isSteaming = ref(false);
// let canvas, context, video, videoObj;

// // create a crop object that will be calculated on load of the video
// // and a variable that will enable us to stop the loop.
// var raf, crop, width, height;

// const getDetection = async () => {
//   axios({
//     method: "POST",
//     url: "https://detect.roboflow.com/badminton-pose-classification/3",
//     params: {
//       api_key: "BfXi3yIE8wjmeJ99oLme",
//       image: "https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/TestData%2Fclear%20forehand%20(1).png?alt=media&token=027118ae-6584-4791-aa25-8e54281666fd"
//     }
//   })
//     .then((response) => {
//       console.log({ res: response.data }, response.data.predictions); 
//       // context.clearRect(0, 0, canvas.width, canvas.height);
//       context.beginPath();
//       const { x, y, height, width } = response.data.predictions[0]
//       context.rect(x, y, width, height);
//       context.stroke();
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// }

// // const generateFeedback = async (pose, correctJsonString) => {
// //   console.log("Generating feedback...");
// //   const incorrectJson = JSON.stringify(pose);
// //   const correctJson = JSON.parse(correctJsonString);
// //   const genAI = new GoogleGenerativeAI(
// //     "AIzaSyAgtqxNm9C9fH1FmIjmBgTMSz5i1xJJgAU"
// //   );
// //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// //   const prompt = `provided the correct pose's coordinates: ${correctJson}. provided the incorrect pose's coordinates: ${incorrectJson}. Teach and instruct the person with incorrect pose to adjust his body in 3 sentence. you dont have to show the adjusted arrays`;

// //   const result = await model.generateContent(prompt);
// //   const response = await result.response;
// //   const feedback = response.text();
// //   attachFeedback(feedback);
// //   speak(feedback);
// // }

// // const attachFeedback = (feedback) => {
// //   const feedbackContainer = document.createElement("li");
// //   feedbackContainer.innerHTML = feedback;
// //   document.getElementById("feedbacks").appendChild(feedbackContainer);
// // }


// async function init() {
//   canvas = document.getElementById("canvas");
//   canvas.style.height = `${height}px`
//   canvas.style.width = `${width}px`
//   context = canvas.getContext("2d");
//   // we don't need to append the video to the document
//   video = document.createElement("video");
//   // var aspect = video.videoHeight / video.videoWidth;
//   // var wantedWidth = width;   // or use height
//   // var height = Math.round(wantedWidth * aspect);
//   // console.log(video.videoHeight,
//   //   video.videoWidth, height)
//   videoObj =
//     navigator.getUserMedia || navigator.mozGetUserMedia ? // our browser is up to date with specs ?
//       {
//         video: {
//           width: { min: width, max: width },
//           height: { min: height, max: height },
//           require: ['width', 'height']
//         }
//       } :
//       {
//         video: {
//           mandatory: {
//             minWidth: width,
//             minHeight: height,
//             maxWidth: width,
//             maxHeight: height
//           }
//         }
//       };

//   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//   // Put video listeners into place
//   navigator.getUserMedia(videoObj, function (stream) {
//     video.srcObject = stream;
//     video.onplaying = function () {
//       isSteaming.value = true;
//       var croppedWidth = (Math.min(video.videoHeight, canvas.height) / Math.max(video.videoHeight, canvas.height)) * Math.min(video.videoWidth, canvas.width),
//         croppedX = (video.videoWidth - croppedWidth) / 2;
//       crop = { w: croppedWidth, h: video.videoHeight, x: croppedX, y: 0 };
//       // call our loop only when the video is playing
//       raf = requestAnimationFrame(loop);
//     };
//     video.play();
//   }, errBack);

//   // now that our video is drawn correctly, we can do...
//   context.translate(canvas.width, 0);
//   context.scale(-1, 1);
// }

// let errBack = (error) => console.log("Video capture error: ", error.code);

// const loop = async () => {
//   if (isSteaming.value != true) return;
//   context.drawImage(video, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);

//   await getDetection();
//   raf = requestAnimationFrame(loop);
// }

// const clickStart = () => {
//   document.getElementById("startButton").style.display = "none";
//   document.getElementById("stopButton").style.display = "block";
//   document.getElementById("pauseButton").style.display = "block";
// }

// const clickCont = () => {
//   document.getElementById("startButton").style.display = "none";
//   document.getElementById("continueButton").style.display = "none";
//   document.getElementById("pauseButton").style.display = "block";
//   document.getElementById("stopButton").style.display = "block";
//   isSteaming.value = true;
//   raf = requestAnimationFrame(loop);
//   video.play();
// }

// const clickPause = () => {
//   document.getElementById("startButton").style.display = "none";
//   document.getElementById("continueButton").style.display = "block";
//   document.getElementById("pauseButton").style.display = "none";
//   document.getElementById("stopButton").style.display = "block";
//   isSteaming.value = false;
//   cancelAnimationFrame(raf);
// }

// const clickStop = () => {
//   document.getElementById("startButton").style.display = "block";
//   document.getElementById("continueButton").style.display = "none";
//   document.getElementById("pauseButton").style.display = "none";
//   document.getElementById("stopButton").style.display = "none";
//   isSteaming.value = false;
//   cancelAnimationFrame(raf);
// }

// onMounted(() => {
//   height = window.innerHeight / 2.3;
//   width = height / 16 * 9;
// });























// const video = document.getElementById("video");

// var model;
// var cameraMode = "environment"; // or "user"

// const startVideoStreamPromise = navigator.mediaDevices
//   .getUserMedia({
//     audio: false,
//     video: {
//       facingMode: cameraMode
//     }
//   })
//   .then(function (stream) {
//     return new Promise(function (resolve) {
//       video.srcObject = stream;
//       video.onloadeddata = function () {
//         video.play();
//         resolve();
//       };
//     });
//   });

// var publishable_key = "rf_XsVPXXU953d69Px5zICOOYiQ5Ch2";
// var toLoad = {
//   model: "badminton-pose-classification",
//   version: 3
// };

// const loadModelPromise = new Promise(function (resolve) {
//   roboflow
//     .auth({
//       publishable_key: publishable_key
//     })
//     .load(toLoad)
//     .then(function (m) {
//       model = m;
//       resolve();
//     });
// });

// Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
//   // $("body").removeClass("loading");
//   resizeCanvas();
//   detectFrame();
// });

// var canvas, ctx;
// const font = "16px sans-serif";

// function videoDimensions(video) {
//   // Ratio of the video's intrisic dimensions
//   var videoRatio = video.videoWidth / video.videoHeight;

//   // The width and height of the video element
//   var width = video.offsetWidth,
//     height = video.offsetHeight;

//   // The ratio of the element's width to its height
//   var elementRatio = width / height;

//   // If the video element is short and wide
//   if (elementRatio > videoRatio) {
//     width = height * videoRatio;
//   } else {
//     // It must be tall and thin, or exactly equal to the original ratio
//     height = width / videoRatio;
//   }

//   return {
//     width: width,
//     height: height
//   };
// }

// // $(window).resize(function () {
// //     resizeCanvas();
// // });

// const resizeCanvas = function () {
//   // $("canvas").remove();

//   canvas = document.getElementById("canvas");

//   ctx = canvas[0].getContext("2d");

//   var dimensions = videoDimensions(video);

//   console.log(
//     video.videoWidth,
//     video.videoHeight,
//     video.offsetWidth,
//     video.offsetHeight,
//     dimensions
//   );

//   canvas[0].width = video.videoWidth;
//   canvas[0].height = video.videoHeight;

//   canvas.css({
//     width: dimensions.width,
//     height: dimensions.height,
//     left: (window.innerWidth - dimensions.width) / 2,
//     top: (window.innerHeight - dimensions.height) / 2
//   });

//   // $("body").append(canvas);
// };

// const renderPredictions = function (predictions) {
//   // var dimensions = videoDimensions(video);

//   var scale = 1;

//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//   predictions.forEach(function (prediction) {
//     const x = prediction.bbox.x;
//     const y = prediction.bbox.y;

//     const width = prediction.bbox.width;
//     const height = prediction.bbox.height;

//     // Draw the bounding box.
//     ctx.strokeStyle = prediction.color;
//     ctx.lineWidth = 4;
//     ctx.strokeRect(
//       (x - width / 2) / scale,
//       (y - height / 2) / scale,
//       width / scale,
//       height / scale
//     );

//     // Draw the label background.
//     ctx.fillStyle = prediction.color;
//     const textWidth = ctx.measureText(prediction.class).width;
//     const textHeight = parseInt(font, 10); // base 10
//     ctx.fillRect(
//       (x - width / 2) / scale,
//       (y - height / 2) / scale,
//       textWidth + 8,
//       textHeight + 4
//     );
//   });

//   predictions.forEach(function (prediction) {
//     const x = prediction.bbox.x;
//     const y = prediction.bbox.y;

//     const width = prediction.bbox.width;
//     const height = prediction.bbox.height;

//     // Draw the text last to ensure it's on top.
//     ctx.font = font;
//     ctx.textBaseline = "top";
//     ctx.fillStyle = "#000000";
//     ctx.fillText(
//       prediction.class,
//       (x - width / 2) / scale + 4,
//       (y - height / 2) / scale + 1
//     );
//   });
// };

// // var prevTime;
// // var pastFrameTimes = [];
// const detectFrame = function () {
//   if (!model) return requestAnimationFrame(detectFrame);

//   model
//     .detect(video)
//     .then(function (predictions) {
//       requestAnimationFrame(detectFrame);
//       renderPredictions(predictions);

//       // if (prevTime) {
//       //     pastFrameTimes.push(Date.now() - prevTime);
//       //     if (pastFrameTimes.length > 30) pastFrameTimes.shift();

//       //     var total = 0;
//       //     _.each(pastFrameTimes, function (t) {
//       //         total += t / 1000;
//       //     });

//       //     // var fps = pastFrameTimes.length / total;
//       //     // $("#fps").text(Math.round(fps));
//       // }
//       // prevTime = Date.now();
//     })
//     .catch(function (e) {
//       console.log("CAUGHT", e);
//       requestAnimationFrame(detectFrame);
//     });
// };
</script>

<style scoped>
img {
  height: 270px;
  width: 480px;
}

#startButton {
  color: limegreen;
}

#continueButton {
  color: orange;
}

#pauseButton {
  color: orange;
}

#stopButton {
  color: red;
}

.base-page__heading span.fa-stack,
.base-page__heading-short span.fa-stack {
  font-size: 12px;
}
</style>