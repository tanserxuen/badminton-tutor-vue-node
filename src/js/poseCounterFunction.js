// import a from "../assets/model"
const poseCounterFunction = {
  html: `
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Teachable Machine Pose Model</h1>
    <div class="d-flex gap-3 my-3">
      <button 
        class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium"
        id="startButton" 
        onclick="init()"
      >
        Start
      </button>
      <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium"
        id="continueButton"
        style="display: none"
        onclick="cont()"
      >
        Continue
      </button>
      <button class="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 font-medium"
        id="pauseButton"
        style="display: none"
        onclick="pause()"
      >
        Pause
      </button>
      <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium"
        id="stopButton"
        style="display: none"
        onclick="dispose()"
      >
        Stop
      </button>
      <button onclick="update()">Update Pose</button>
    </div>

    <div><canvas id="canvas"></canvas></div>
    
    <div id="label-container"></div>
  `,
  func: `
    var URL = "/model/";
    var cameraActivated = false;
    var model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
        var modelURL = URL + "model.json";
        var metadataURL = URL + "metadata.json";

        document.getElementById("startButton").style.display = "none";
        document.getElementById("stopButton").style.display = "block";
        document.getElementById("pauseButton").style.display = "block";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from squatCountText file picker
        // Note: the pose library adds squatCountText tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup squatCountText webcam
        const size = 500;
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
        }
    }

    var counts = {
      Big:0,
      Squat:0,
      Kick:0
    };
    

    var squatCountText = document.createElement("p");
    var bigCountText = document.createElement("p");
    var kickPoseText = document.createElement("p");
    var prevPoseText = document.createElement("p");
    squatCountText.setAttribute("id", "squat-count");
    bigCountText.setAttribute("id", "big-count");
    kickPoseText.setAttribute("id", "kick-count");
    prevPoseText.setAttribute("id", "prev-pose");

    var prevPose = '';
    async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model.estimatePose(
            webcam.canvas
        );
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            if(prevPose !== prediction[i].className) getPoseCount(
                prediction[i].className,
                prediction[i].probability.toFixed(2)
            );
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        // finally draw the poses
        drawPose(pose);
    }

    function getPoseCount(className, probability) {
      console.log(className, probability);
      if (probability > 0.9) {
        counts[className] ++;
        prevPose = className;
      }
      labelContainer.appendChild(squatCountText);
      labelContainer.appendChild(bigCountText);
      labelContainer.appendChild(kickPoseText);
      labelContainer.appendChild(prevPoseText);
      document.getElementById("squat-count").innerText = "Squat: "+String(counts.Squat);
      document.getElementById("big-count").innerText = "Big: "+String(counts.Big);
      document.getElementById("kick-count").innerText = "Kick: "+String(counts.Kick);
      document.getElementById("prev-pose").innerText = "prevPose: "+prevPose;
    }

    function cont() {
        console.log("cont", webcam);
        document.getElementById("startButton").style.display = "none";
        document.getElementById("continueButton").style.display =
            "none";
        document.getElementById("pauseButton").style.display = "block";
        document.getElementById("stopButton").style.display = "block";
        cameraActivated = true;
        webcam.play();
        loop();
    }

    function pause() {
        document.getElementById("startButton").style.display = "none";
        document.getElementById("continueButton").style.display =
            "block";
        document.getElementById("pauseButton").style.display = "none";
        document.getElementById("stopButton").style.display = "block";
        webcam.pause();
        cameraActivated = false;
    }

    function dispose() {
        document.getElementById("startButton").style.display = "block";
        document.getElementById("continueButton").style.display =
            "none";
        document.getElementById("pauseButton").style.display = "none";
        document.getElementById("stopButton").style.display = "none";
        webcam.stop();
        cameraActivated = false;
    }

    function drawPose(pose) {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(
                    pose.keypoints,
                    minPartConfidence,
                    ctx
                );
                tmPose.drawSkeleton(
                    pose.keypoints,
                    minPartConfidence,
                    ctx
                );
            }
        }
    }
    
    // window.addEventListener("beforeunload", function(event) {
      function update() {
      console.log("beforeunload");
      // event.preventDefault();
      axios.post("/api/pose/update", {id: sessionStorage.getItem("uid"), pose:counts});
      }
    // });
    `,
  scripts: [
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js",
    "https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.7/axios.min.js",
  ],
};
export default poseCounterFunction;
