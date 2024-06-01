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
        <canvas id="canvas" height="160" width="160"></canvas>
        <img id="correctPostImage" src="https://placehold.co/350x220" alt="" />
        <h1 id="currentPose" class="text-6xl"></h1>
      </div>
      <div id="label-container"></div>
      <ol id="feedbacks"></ol>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
// import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// let webcam, cameraActivated = false;

const getDetection = async () => {
  axios({
    method: "POST",
    url: "https://detect.roboflow.com/badminton-pose-classification/3",
    params: {
      api_key: "BfXi3yIE8wjmeJ99oLme",
      image: "https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/TestData%2Fclear%20forehand%20(1).png?alt=media&token=027118ae-6584-4791-aa25-8e54281666fd"
    }
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// const generateFeedback = async (pose, correctJsonString) => {
//   console.log("Generating feedback...");
//   const incorrectJson = JSON.stringify(pose);
//   const correctJson = JSON.parse(correctJsonString);
//   const genAI = new GoogleGenerativeAI(
//     "AIzaSyAgtqxNm9C9fH1FmIjmBgTMSz5i1xJJgAU"
//   );
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const prompt = `provided the correct pose's coordinates: ${correctJson}. provided the incorrect pose's coordinates: ${incorrectJson}. Teach and instruct the person with incorrect pose to adjust his body in 3 sentence. you dont have to show the adjusted arrays`;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const feedback = response.text();
//   attachFeedback(feedback);
//   speak(feedback);
// }

// const attachFeedback = (feedback) => {
//   const feedbackContainer = document.createElement("li");
//   feedbackContainer.innerHTML = feedback;
//   document.getElementById("feedbacks").appendChild(feedbackContainer);
// }


async function init() {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  // we don't need to append the video to the document
  let video = document.createElement("video");
  let videoObj =
    navigator.getUserMedia || navigator.mozGetUserMedia ? // our browser is up to date with specs ?
      {
        video: {
          width: { min: 1280, max: 1280 },
          height: { min: 720, max: 720 },
          require: ['width', 'height']
        }
      } :
      {
        video: {
          mandatory: {
            minWidth: 1280,
            minHeight: 720,
            maxWidth: 1280,
            maxHeight: 720
          }
        }
      };

  let errBack = function (error) {
    console.log("Video capture error: ", error.code);
  };

  // create a crop object that will be calculated on load of the video
  var crop;
  // create a variable that will enable us to stop the loop.
  var raf;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  // Put video listeners into place
  navigator.getUserMedia(videoObj, function (stream) {
    video.srcObject = stream;
    video.onplaying = function () {
      var croppedWidth = (Math.min(video.videoHeight, canvas.height) / Math.max(video.videoHeight, canvas.height)) * Math.min(video.videoWidth, canvas.width),
        croppedX = (video.videoWidth - croppedWidth) / 2;
      crop = { w: croppedWidth, h: video.videoHeight, x: croppedX, y: 0 };
      // call our loop only when the video is playing
      raf = requestAnimationFrame(loop);
    };
    video.onpause = function () {
      // stop the loop
      cancelAnimationFrame(raf);
    }
    video.play();
  }, errBack);

  const loop = async () => {
    context.drawImage(video, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);

    await getDetection();
    raf = requestAnimationFrame(loop);
  }
  // now that our video is drawn correctly, we can do...
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
}

// const loop = async () => {
//   webcam.update(); // update the webcam frame
//   if (cameraActivated) {
//     // setTimeout(() => {
//     window.requestAnimationFrame(loop);
//     // }, 1000 / fps);
//     // console.log({ isGeneratingFeedback });
//   }
// }

const clickStart = () => {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "block";
}

const clickCont = () => {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "block";
  document.getElementById("stopButton").style.display = "block";
  // cameraActivated = true;
  // webcam.play();
  // loop();
}

const clickPause = () => {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("continueButton").style.display = "block";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "block";
  // webcam.pause();
  // cameraActivated = false;
}

const clickStop = () => {
  document.getElementById("startButton").style.display = "block";
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("stopButton").style.display = "none";
  // webcam.stop();
  // cameraActivated = false;
}

// return {
//   generateFeedback,
//   init,
//   clickStart,
//   clickCont,
//   clickPause,
//   clickStop,
//   backToApp,
// }
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