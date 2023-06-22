const progressBar = document.getElementById("progress-bar");
var scores = [20, 20, 20, 20];
var prevScore = 90;
var prevWidth = 80;
var curWidth;
var scoreRecords = [];
for (var i = 0; i < 150; i++) {
  scoreRecords.push(80);
}

let check_score = false;
let turnlist = "";
socket.on("update_score", (data) => {
  //console.log(Math.round(data.score));

  console.log("current width" + curWidth);

  if (check_score == true) {
    console.log("curwidth being analysed");
    if (curWidth < 0) {
      scores = [20, 20, 20, 20];
      prevScore = 90;
      prevWidth = 80;
      scoreRecords = [];
      console.log("curwidth less than zero");
      socket.emit("round-over", { cur_turn: turnlist });
      for (var i = 0; i < 150; i++) {
        scoreRecords.push(80);
      }
    }
  }
  socket.on("start-judging", (data) => {
    console.log("judging starting");
    check_score = true;
    turnlist = data.turn;
  });
  scores.shift();
  scores.push(Math.round(data.score));
  var avg = 0;
  var i;
  for (i = 0; i < scores.length; i++) {
    avg += scores[i];
  }
  var curMax = Math.max(...scoreRecords);
  var curScore = avg / scores.length;
  if (Number.isNaN(curScore)) {
    scoreRecords.shift();
    scoreRecords.push(50);
    curScore = 50;
    curMax = 100;
  }
  var curMax = Math.max(...scoreRecords);
  var curScore = avg / scores.length;
  if (Number.isNaN(curScore)) {
    scoreRecords.shift();
    scoreRecords.push(50);
    curScore = 50;
    curMax = 100;
  } else {
    if (curScore > curMax) {
      scoreRecords.shift();
      scoreRecords.push(curScore);
    } else {
      scoreRecords.shift();
      scoreRecords.push(curMax - 20);
    }
  }

  if (curScore < 60 || curScore < prevScore || curScore < curMax) {
    console.log("Case 1: " + prevWidth);
    console.log(curScore + " " + curMax);
    prevScore = curScore;
    prevWidth = prevWidth - 0.05;
    curWidth = prevWidth;
    progressBar.style = `width: ${Math.round(prevWidth)}%`;
  } else {
    var diff = curScore - curMax;
    curWidth = prevWidth + diff;
    console.log("Case 2: " + curWidth);
    console.log(curScore + " " + curMax);
    prevScore = curScore;
    progressBar.style = `width: ${Math.round(curWidth)}%`;
    prevWidth = curWidth;
  }
  //console.log(`width: ${progressBar.style.width}`)
  //console.log(`max: ${progressBar.getAttribute('aria-valuemax')}`)
  let percentage = parseFloat(progressBar.style.width) / 100.0;
  const minHue = 80;
  const maxHue = 235;
  let hue = Math.round(minHue + percentage * (maxHue - minHue));

  if (!Number.isNaN(hue)) {
    // progressBar.style.backgroundColor = `hsl(` + hue + `, 100%, 100%)`
    progressBar.style.backgroundColor = `rgb(235, ${hue}, 52)`;
  }

  //console.log(`background-color: hsl(${hue}, 100%, 100%)`)
  //console.log(progressBar.style.backgroundColor)
  //console.log("recieve cur_score");
});
