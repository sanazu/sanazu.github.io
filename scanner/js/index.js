const result = document.getElementsByClassName("result")[0];
const resultData = document.getElementById("result");
const scanner = document.getElementsByClassName("scanner")[0];
function showResult(data) {
  result.style.display = "";
  scanner.style.display = "none";
  resultData.innerText = data;
}

function scan() {
  result.style.display = "none";
  scanner.style.display = "";
  resultData.innerText = "";
}
window.addEventListener("DOMContentLoaded", () => {
  const video = document.createElement("video");
  // Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
      },
    })
    .then(function (stream) {
      localStream = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
    });

  requestAnimationFrame(tick);

  function tick() {
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;

      canvasElement.height = 480; //video.videoHeight;
      canvasElement.width = 640; //video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code && code.data) {
        showResult(code.data);
        copyTextToClipboard(code.data);
      }
    }

    requestAnimationFrame(tick);
  }
});
