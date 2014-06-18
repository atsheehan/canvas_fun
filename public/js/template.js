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

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.95;

var SCREEN_WIDTH = ctx.canvas.width;
var SCREEN_HEIGHT = ctx.canvas.height;

var ball = {
  x: SCREEN_WIDTH / 2,
  y: SCREEN_HEIGHT / 2,
  radius: SCREEN_HEIGHT / 50,
  xVel: SCREEN_WIDTH / 100,
  isStopped: false
};

function draw() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  // Draw elements of the game here.
  // Can use `drawRect` and `drawCircle` function.
  // e.g. draw the ball colored green
  drawCircle(ball.x, ball.y, ball.radius, 'green');
}

function tick() {
  // Update game logic here.
  // e.g. moving a ball back and forth across the screen

  if (!ball.isStopped) {

    ball.x += ball.xVel;

    // Reverse when ball hits right or left side of the screen.
    if ((ball.xVel > 0 && (ball.x + ball.radius) > SCREEN_WIDTH ||
         (ball.xVel < 0 && (ball.x - ball.radius) < 0))) {
      ball.xVel = -ball.xVel;
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

  // Handle user input here when a key is pressed.
  // A few key constants are defined in /js/key_codes.js
  // e.g. stops the ball from moving when pressing down the space bar

  case SPACE_KEY:
    ball.isStopped = true;
    break;

  default:
    handled = false;
    break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function keyUp(event) {
  var handled = true;

  switch (event.keyCode) {

  // Handle user input here when a key is released.
  // A few key constants are defined in /js/key_codes.js
  // e.g. starts the ball moving again when releasing space bar

  case SPACE_KEY:
    ball.isStopped = false;
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
  window.onkeyup = keyUp;

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

run();
