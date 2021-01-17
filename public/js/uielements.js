const progressBar = document.getElementById("progress-bar");
var scores = [20, 20, 20, 20]

socket.on("update_score", (data) => {
  console.log(Math.round(data.score));
  scores.shift()
  scores.push(Math.round(data.score))
  var avg = 0
  var i
  for(i = 0; i < 4; i++){
    avg += scores[i]
  }

  progressBar.style=  `width: ${Math.round(avg/4)}%`
  console.log(`width: ${progressBar.style.width}`)
  console.log(`max: ${progressBar.getAttribute('aria-valuemax')}`)
  let percentage = parseFloat(progressBar.style.width) / 100.0;
  const minHue = 80
  const maxHue = 235
  let hue = Math.round(minHue + (percentage * (maxHue - minHue)))

  if (!Number.isNaN(hue)){
    // progressBar.style.backgroundColor = `hsl(` + hue + `, 100%, 100%)`
    progressBar.style.backgroundColor = `rgb(235, ${hue}, 52)`
  }

  console.log(`background-color: hsl(${hue}, 100%, 100%)`)
  console.log(progressBar.style.backgroundColor)
  console.log("recieve cur_score");
});




var container = document.getElementById('container');
var emoji = ['😂'];
var circles = [];

// how many circles
const circleNumber = 5;
let circleFreq = laughScore;
for (let i = 0; i < circleNumber; i++) {
  addCircle(i * circleFreq, [27 + 100, 50], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * circleFreq, [39 + 300, 50], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * circleFreq, [46 + 500, 50], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * circleFreq, [58 + 700, 50], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * circleFreq, [70 + 1000, 50], emoji[Math.floor(Math.random() * emoji.length)]);
}

function addCircle(delay, range, color) {
  setTimeout(function() {
    var c = new Circle(range[0] + Math.random() * range[1], 80 + Math.random() * 4, color, {
      x: -0.15 + Math.random() * 0.3,
      y: 1 + Math.random() * 1
    }, range);
    circles.push(c);
  }, delay);
}

function Circle(x, y, c, v, range) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.color = c;
  this.v = v;
  this.range = range;
  this.element = document.createElement('span');
  /*this.element.style.display = 'block';*/
  this.element.style.opacity = 0;
  this.element.style.position = 'absolute';
  this.element.style.fontSize = '26px';
  this.element.innerHTML = c;
  container.appendChild(this.element);

  this.update = function() {
    if (_this.y > 220) {
      _this.y = 80 + Math.random() * 4;
      _this.x = _this.range[0] + Math.random() * _this.range[1];
    }
    _this.y += _this.v.y;
    _this.x += _this.v.x;
    this.element.style.opacity = 1;
    this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
  };
}

function animate() {
  for (var i in circles) {
    circles[i].update();
  }
  requestAnimationFrame(animate);
}

animate();