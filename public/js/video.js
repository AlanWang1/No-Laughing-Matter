const socket = io("/");
//const faceapi = require('face-api.js')

const videoGrid = document.getElementById("video-grid");
const names = document.getElementById("name");
const myPeer = new Peer(undefined, {
  secure: true,
  host: "peerjs-rory.herokuapp.com",
  port: "443",
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(() => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      addVideoStream(myVideo, stream, true);

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        // user is joining
        setTimeout(() => {
          // user joined
          connectToNewUser(userId, stream);
        }, 3000);
      });
    });
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  console.log("e");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.parentElement.remove();
  });

  peers[userId] = call;
}

function score(happy, surprised, diffX, diffY) {
  let diffScore = 20;
  if ((diffX + diffY) / 20 > 1) {
    diffScore = 1;
  } else {
    diffScore = (diffX + diffY) / 20;
  }
  let surprisedScore = 20;
  if (surprised > 1) {
    surprisedScore = 1;
  } else {
    surprisedScore = surprised;
  }
  return 100 * (happy * 0.5 + surprisedScore * 0.4 + diffScore * 0.1);
}
function runningavg(arr) {
  let avg = 0;
  let count = arr.length;
  var i;
  for (i = 0; i < arr.length; i++) {
    try {
      avg += arr[i];
    } catch (error) {
      count--;
    }
  }
  if (count == 0) return avg;
  return avg / count;
}

function addVideoStream(video, stream, me = false) {
  if (
    Array.from(videoGrid.children).some(
      (cell) => cell.getElementsByTagName("video")[0].srcObject.id === stream.id
    )
  )
    return;
  video.srcObject = stream;
  if (me) video.style.transform = "rotateY(180deg)";
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    //const newDiv=document.createElement("div")
    //video.appendChild(canvas)
    // videoGrid.append(canvas)
    // const displaySize = { width: video.offsetWidth, height: video.offsetHeight}
    // faceapi.matchDimensions(canvas, displaySize)
    var prevX = 100;
    var prevY = 100;
    var running_average_array = [60, 60, 60, 60, 60];
    let flag = false;
    let maxscore = 60;
    let referenceMouth = 0;
    let cur_average;
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      // const resizedDetections = faceapi.resizeResults(detections, displaySize)
      // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      // faceapi.draw.drawDetections(canvas, resizedDetections)
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      // console.log(detections)
      // console.log(detections[0].expressions.happy)
      let diffX = Math.abs(prevX - detections[0].detection._box.x);
      let diffY = Math.abs(prevY - detections[0].detection._box.y);
      prevX = detections[0].detection._box.x;
      prevY = detections[0].detection._box.y;
      let happy = detections[0].expressions.happy;
      let mouth =
        detections[0].landmarks.positions[57].y -
        detections[0].landmarks.positions[51].y;
      //console.log(happy)
      //console.log(surprised)
      //console.log(diffX)
      //console.log(diffY)
      //console.log(mouth - referenceMouth)
      //console.log(referenceMouth)
      //console.log(score(happy, surprised, diffX, diffY))
      if (!flag) {
        referenceMouth = mouth - 8;
        flag = true;
      }
      //console.log("Max = " + maxscore)
      // console.log("Current score = " + score(happy, (mouth - referenceMouth) * 0.033, diffX, diffY))

      var cur_score = score(
        happy,
        (mouth - referenceMouth) * 0.042,
        diffX,
        diffY
      );

      running_average_array.shift();
      running_average_array.push(cur_score);
      cur_average = runningavg(running_average_array);
      //score(happy, (mouth - referenceMouth) * 0.033, diffX, diffY)
      //if(!flag){
      //  flag=true
      //  maxscore = 60
      // }
      maxscore = Math.max(cur_average, maxscore);
      //console.log("Current avg = " + cur_average)

      socket.emit("cur_score", { current_score: cur_average });
      //socket.emit('cur_avg', {current_average: cur_average})
      //console.log(detections[0].landmarks.__proto__)
      //document.getElementById("score").innerHTML = "Current score: " + score(happy, (mouth - referenceMouth) * 0.033, diffX, diffY).toString()
      //document.getElementById("maxscore").innerHTML = "Max score: "+maxscore.toString()
    }, 500);
  });
  const videoCell = document.createElement("div");
  videoCell.id = "video-cell";
  videoCell.appendChild(video);
  videoCell.className = "video-box";
  console.log(turnorder);
  let name = document.createElement("p");
  //name.innerText = socket.id // Put name here pls
  videoCell.appendChild(name);

  videoGrid.appendChild(videoCell);
}
