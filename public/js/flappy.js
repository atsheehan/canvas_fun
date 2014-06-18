function drawRect(x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, radius, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePipe(leftEdge) {
  var opening = getRandomInt(0, SCREEN_HEIGHT - OPENING_HEIGHT);

  return {
    top: {
      x: leftEdge,
      y: 0,
      width: PIPE_WIDTH,
      height: opening
    },

    bottom: {
      x: leftEdge,
      y: opening + OPENING_HEIGHT,
      width: PIPE_WIDTH,
      height: SCREEN_HEIGHT - opening + OPENING_HEIGHT
    }
  };
}

function intersects(circle, rect) {
  // Circle-Rectangle collision detection as described in:
  // http://stackoverflow.com/a/402010
  var rectCenterX = rect.x + (rect.width / 2);
  var rectCenterY = rect.y + (rect.height / 2);

  var distanceX = Math.abs(circle.x - rectCenterX);
  var distanceY = Math.abs(circle.y - rectCenterY);

  if (distanceX > (rect.width / 2 + circle.radius) ||
      distanceY > (rect.height / 2 + circle.radius)) {
    return false;
  }

  if (distanceX <= (rect.width / 2) ||
      distanceY <= (rect.height / 2)) {
    return true;
  }

  var cornerDistanceSq =
    Math.pow((distanceX - rect.width / 2), 2) +
    Math.pow((distanceY - rect.height / 2), 2)

  return cornerDistanceSq <= Math.pow(circle.radius, 2);
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.95;

var SCREEN_WIDTH = ctx.canvas.width;
var SCREEN_HEIGHT = ctx.canvas.height;

var GRAVITY = SCREEN_HEIGHT / 800;
var MAX_SPEED = SCREEN_HEIGHT / 50;
var JUMP_VEL = -(SCREEN_HEIGHT / 30);
var WIZ_RADIUS = SCREEN_HEIGHT / 50;

var PIPES_PER_SCREEN = 3;
var PIPE_WIDTH = SCREEN_WIDTH / 15;
var PIPE_SPACING = SCREEN_WIDTH / PIPES_PER_SCREEN;
var OPENING_HEIGHT = WIZ_RADIUS * 12;

var cameraX = 0;
var gameOver = false;

var wiz = {
  x: SCREEN_WIDTH / 2,
  y: SCREEN_HEIGHT / 2,
  radius: WIZ_RADIUS,
  yVel: 0,
  xVel: SCREEN_WIDTH / 150
};

var pipes = [];
var nextPipeStart = SCREEN_WIDTH;

for (var i = 0; i < PIPES_PER_SCREEN + 1; i++) {
  pipes.push(generatePipe(nextPipeStart));
  nextPipeStart += PIPE_SPACING;
}

function draw() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  if (gameOver) {
    var color = 'red';
  } else {
    var color = 'white';
  }

  for (var i = 0; i < pipes.length; i++) {
    var pipe = pipes[i];

    drawRect(pipe.top.x - cameraX, pipe.top.y,
             pipe.top.width, pipe.top.height, 'green');

    drawRect(pipe.bottom.x - cameraX, pipe.bottom.y,
             pipe.bottom.width, pipe.bottom.height, 'green');
  }

  drawCircle(wiz.x - cameraX, wiz.y, WIZ_RADIUS, color);
}

function tick() {
  if (!gameOver) {

    wiz.yVel += GRAVITY;

    if (wiz.yVel > MAX_SPEED) {
      wiz.yVel = MAX_SPEED;
    }

    if (wiz.yVel < -MAX_SPEED) {
      wiz.yVel = -MAX_SPEED;
    }

    wiz.y += wiz.yVel;
    wiz.x += wiz.xVel;

    cameraX += wiz.xVel;

    if (wiz.y - wiz.radius < 0 || wiz.y + wiz.radius > SCREEN_HEIGHT) {
      gameOver = true;
    }

    if (pipes[0].top.x + pipes[0].top.width < cameraX) {
      pipes.shift();
      pipes.push(generatePipe(nextPipeStart));
      nextPipeStart += PIPE_SPACING;
    }

    for (var i = 0; i < pipes.length; i++) {
      var pipe = pipes[i];

      if (intersects(wiz, pipe.top) || intersects(wiz, pipe.bottom)) {
        gameOver = true;
      }
    }
  }
}

function loop(time) {
  tick();
  draw();

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

function keyDown(event) {
  var handled = true;

  switch (event.keyCode) {

  case SPACE_KEY:
    wiz.yVel = JUMP_VEL;
    break;

  default:
    handled = false;
    break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function run() {
  window.onkeydown = keyDown;

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

run();
