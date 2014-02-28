var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var CANVAS_WIDTH = ctx.canvas.width;
var CANVAS_HEIGHT = ctx.canvas.height;

var PADDLE_WIDTH = CANVAS_WIDTH / 32;
var PADDLE_HEIGHT = CANVAS_HEIGHT / 8;

var BALL_RADIUS = PADDLE_WIDTH / 2;

var PADDLE_START_Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
var LEFT_PADDLE_START_X = CANVAS_WIDTH / 10;
var RIGHT_PADDLE_START_X = (9 * CANVAS_WIDTH / 10) - PADDLE_WIDTH;

var PADDLE_SPEED = 5;
var BALL_SPEED = 3;

var leftPaddle = {
  x: LEFT_PADDLE_START_X,
  y: PADDLE_START_Y,
  movingUp: false,
  movingDown: false
};

var rightPaddle = {
  x: RIGHT_PADDLE_START_X,
  y: PADDLE_START_Y,
  movingUp: false,
  movingDown: false
};

var ball = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
  xVel: BALL_SPEED,
  yVel: BALL_SPEED
};

var gameOver = false;
var livesRemaining = 3;
var score = 0;

function keyDown(event) {
  switch (event.keyCode) {
  case Q_KEY: leftPaddle.movingUp = true;    break;
  case A_KEY: leftPaddle.movingDown = true;  break;
  case P_KEY: rightPaddle.movingUp = true;   break;
  case L_KEY: rightPaddle.movingDown = true; break;
  }
}

function keyUp(event) {
  switch (event.keyCode) {
  case Q_KEY: leftPaddle.movingUp = false;    break;
  case A_KEY: leftPaddle.movingDown = false;  break;
  case P_KEY: rightPaddle.movingUp = false;   break;
  case L_KEY: rightPaddle.movingDown = false; break;
  }
}

function updatePaddle(paddle) {
  var paddleVel = 0;

  if (paddle.movingUp) {
    paddleVel -= PADDLE_SPEED;
  }

  if (paddle.movingDown) {
    paddleVel += PADDLE_SPEED;
  }

  paddle.y += paddleVel;

  if (paddle.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
    paddle.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
  }

  if (paddle.y < 0) {
    paddle.y = 0;
  }
}

function updateBall(ball) {
  ball.x += ball.xVel;
  ball.y += ball.yVel;

  if (ball.x - BALL_RADIUS > CANVAS_WIDTH || ball.x + BALL_RADIUS < 0) {

    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    livesRemaining--;

  } else if ((ball.xVel > 0 &&
         ball.x + BALL_RADIUS > rightPaddle.x &&
         ball.x - BALL_RADIUS <= rightPaddle.x &&
         ball.y + BALL_RADIUS >= rightPaddle.y &&
         ball.y - BALL_RADIUS <= rightPaddle.y + PADDLE_HEIGHT) ||
        (ball.x - BALL_RADIUS < leftPaddle.x + PADDLE_WIDTH &&
         ball.x + BALL_RADIUS >= leftPaddle.x + PADDLE_WIDTH &&
         ball.y + BALL_RADIUS >= leftPaddle.y &&
         ball.y - BALL_RADIUS <= leftPaddle.y + PADDLE_HEIGHT)) {

    ball.xVel = -ball.xVel;
    score++;
  }

  if ((ball.yVel > 0 && ball.y + BALL_RADIUS > CANVAS_HEIGHT) ||
      (ball.yVel < 0 && ball.y - BALL_RADIUS < 0)) {

    ball.yVel = -ball.yVel;
  }

  if (livesRemaining < 0) {
    gameOver = true;
  }
}

function tick() {
  if (!gameOver) {
    updatePaddle(leftPaddle);
    updatePaddle(rightPaddle);
    updateBall(ball);
  }
}

function drawRect(ctx, x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.fillRect(x, y, w, h);
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  var color = 'white';

  drawRect(ctx, leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, color);
  drawRect(ctx, rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, color);
  drawCircle(ctx, ball.x, ball.y, BALL_RADIUS, 'white');

  ctx.font = '24px monospace';
  ctx.fillText("lives: " + livesRemaining, 0, 24);

  ctx.font = '24px monospace';
  ctx.fillText("score: " + score, CANVAS_WIDTH - 200, 24);

  if (gameOver) {
    ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
}

function loop(time) {
  tick();
  draw();

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

function run() {
  window.onkeydown = keyDown;
  window.onkeyup = keyUp;

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

run();
