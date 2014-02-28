var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = context.canvas.width;
var CANVAS_HEIGHT = context.canvas.height;

var A_KEY = 65;
var Q_KEY = 81;
var P_KEY = 80;
var L_KEY = 76;

var UP_ARROW = 38;
var DOWN_ARROW = 40;

var PADDLE_WIDTH = CANVAS_WIDTH / 32;
var PADDLE_HEIGHT = CANVAS_HEIGHT / 8;

var BALL_RADIUS = PADDLE_WIDTH / 2;

var PADDLE_START_Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
var PADDLE1_START_X = CANVAS_WIDTH / 10;
var PADDLE2_START_X = (9 * CANVAS_WIDTH / 10) - PADDLE_WIDTH;

var PADDLE_SPEED = 5;
var BALL_SPEED = 3;

var p1Paddle = { x: PADDLE1_START_X, y: PADDLE_START_Y };
var p2Paddle = { x: PADDLE2_START_X, y: PADDLE_START_Y };

var ball = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
  xVel: BALL_SPEED,
  yVel: BALL_SPEED
};

var p1MovingUp = false;
var p1MovingDown = false;

var p2MovingUp = false;
var p2MovingDown = false;

var gameOver = false;

var livesRemaining = 3;
var score = 0;

function keyDown(event) {
  switch (event.keyCode) {

  case Q_KEY:
    p1MovingUp = true;
    break;

  case A_KEY:
    p1MovingDown = true;
    break;

  case P_KEY:
    p2MovingUp = true;
    break;

  case L_KEY:
    p2MovingDown = true;
    break;
  }
}

function keyUp(event) {
  switch (event.keyCode) {

  case Q_KEY:
    p1MovingUp = false;
    break;

  case A_KEY:
    p1MovingDown = false;
    break;

  case P_KEY:
    p2MovingUp = false;
    break;

  case L_KEY:
    p2MovingDown = false;
    break;
  }
}

function tick() {

  if (!gameOver) {
    var p1PaddleVel = 0;

    if (p1MovingUp) {
      p1PaddleVel -= PADDLE_SPEED;
    }

    if (p1MovingDown) {
      p1PaddleVel += PADDLE_SPEED;
    }

    p1Paddle.y += p1PaddleVel;

    if (p1Paddle.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
      p1Paddle.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
    }

    if (p1Paddle.y < 0) {
      p1Paddle.y = 0;
    }

    var p2PaddleVel = 0;

    if (p2MovingUp) {
      p2PaddleVel -= PADDLE_SPEED;
    }

    if (p2MovingDown) {
      p2PaddleVel += PADDLE_SPEED;
    }

    p2Paddle.y += p2PaddleVel;

    if (p2Paddle.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
      p2Paddle.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
    }

    if (p2Paddle.y < 0) {
      p2Paddle.y = 0;
    }

    ball.x += ball.xVel;
    ball.y += ball.yVel;

    if (ball.xVel > 0) {
      if (ball.x - BALL_RADIUS > CANVAS_WIDTH) {
        ball.x = CANVAS_WIDTH / 2;
        ball.y = CANVAS_HEIGHT / 2;

        livesRemaining--;

      } else if (ball.x + BALL_RADIUS > p2Paddle.x &&
                 ball.x - BALL_RADIUS <= p2Paddle.x &&
                 ball.y + BALL_RADIUS >= p2Paddle.y &&
                 ball.y - BALL_RADIUS <= p2Paddle.y + PADDLE_HEIGHT) {

        ball.xVel = -ball.xVel;
        score += 1;
      }

    } else {
      if (ball.x + BALL_RADIUS < 0) {
        ball.x = CANVAS_WIDTH / 2;
        ball.y = CANVAS_HEIGHT / 2;

        livesRemaining--;

      } else if (ball.x - BALL_RADIUS < p1Paddle.x + PADDLE_WIDTH &&
                 ball.x + BALL_RADIUS >= p1Paddle.x + PADDLE_WIDTH &&
                 ball.y + BALL_RADIUS >= p1Paddle.y &&
                 ball.y - BALL_RADIUS <= p1Paddle.y + PADDLE_HEIGHT) {

        ball.xVel = -ball.xVel;
        score += 1;
      }
    }

    if (ball.yVel > 0) {
      if (ball.y + BALL_RADIUS > CANVAS_HEIGHT) {
        ball.yVel = -ball.yVel;
      }

    } else {
      if (ball.y - BALL_RADIUS < 0) {
        ball.yVel = -ball.yVel;
      }
    }

    if (livesRemaining < 0) {
      gameOver = true;
    }
  }
}

function draw() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = 'white';
  context.fillStyle = 'white';

  context.fillRect(p1Paddle.x, p1Paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  context.fillRect(p2Paddle.x, p2Paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

  context.beginPath();
  context.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, false);
  context.fill();

  context.font = '24px monospace';
  context.fillText("lives: " + livesRemaining, 0, 24);

  context.font = '24px monospace';
  context.fillText("score: " + score, CANVAS_WIDTH - 200, 24);

  if (gameOver) {
    context.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
}

function loop(time) {
  tick();
  draw();

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

function start() {
  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

window.onkeydown = keyDown;
window.onkeyup = keyUp;
start();
