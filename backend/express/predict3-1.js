const toLoad = {
  model: "badminton-pose-classification",
  version: 3,
};
const publishable_key = "rf_XsVPXXU953d69Px5zICOOYiQ5Ch2";
const video = document.getElementById("video");

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
          video.play();
          resolve();
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

Promise.all([startVideoStreamPromise(video), loadModelPromise]).then(
  //   function () {
  //     resizeCanvas();
  //     detectFrame();
  //   }
  console.log("done")
);
