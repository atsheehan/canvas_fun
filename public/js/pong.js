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
var INITIAL_BALL_SPEED = 3;

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
  xVel: INITIAL_BALL_SPEED,
  yVel: 0,
  speed: INITIAL_BALL_SPEED,
  isStuck: true
};

var gameOver = false;
var livesRemaining = 3;
var score = 0;

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function rotateVector(vec, radians) {
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);

  return {
    x: (vec.x * cos) - (vec.y * sin),
    y: (vec.x * sin) + (vec.y * cos)
  };
}

function keyDown(event) {
  var handled = true;

  switch (event.keyCode) {
  case Q_KEY: leftPaddle.movingUp = true;    break;
  case A_KEY: leftPaddle.movingDown = true;  break;
  case P_KEY: rightPaddle.movingUp = true;   break;
  case L_KEY: rightPaddle.movingDown = true; break;
  case SPACE_KEY: ball.isStuck = false;      break;
  default: handled = false;                  break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function keyUp(event) {
  var handled = true;

  switch (event.keyCode) {
  case Q_KEY: leftPaddle.movingUp = false;    break;
  case A_KEY: leftPaddle.movingDown = false;  break;
  case P_KEY: rightPaddle.movingUp = false;   break;
  case L_KEY: rightPaddle.movingDown = false; break;
  default: handled = false;                  break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function updatePaddle(paddle) {
  var paddleVel = 0;

  if (paddle.movingUp) paddleVel -= PADDLE_SPEED;
  if (paddle.movingDown) paddleVel += PADDLE_SPEED;

  paddle.y += paddleVel;

  if (paddle.y + PADDLE_HEIGHT > CANVAS_HEIGHT) {
    paddle.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
  }

  if (paddle.y < 0) {
    paddle.y = 0;
  }
}

function collisionExistsBetween(ball, paddle) {
  return (
    // ball is within y-boundary of paddle
    (ball.y + BALL_RADIUS >= paddle.y &&
     ball.y - BALL_RADIUS <= paddle.y + PADDLE_HEIGHT)

      &&

    // ball has crossed over the left edge of the paddle
    ((ball.xVel > 0 &&
      ball.x + BALL_RADIUS > paddle.x &&
      ball.x - BALL_RADIUS <= paddle.x)

     ||

     // or ball has crossed over the right edge
     (ball.xVel < 0 &&
      ball.x - BALL_RADIUS < paddle.x + PADDLE_WIDTH &&
      ball.x + BALL_RADIUS >= paddle.x + PADDLE_WIDTH)));
}

function isBeyondEdges(ball) {
  return (ball.x - BALL_RADIUS > CANVAS_WIDTH || ball.x + BALL_RADIUS < 0);
}

function hasCollidedWithWall(ball) {
  return (
    (ball.yVel > 0 && ball.y + BALL_RADIUS > CANVAS_HEIGHT) ||
    (ball.yVel < 0 && ball.y - BALL_RADIUS < 0));
}

function resetBall(ball) {
  ball.x = CANVAS_WIDTH / 2;
  ball.y = CANVAS_HEIGHT / 2;
  ball.xVel = INITIAL_BALL_SPEED;
  ball.yVel = 0;
  ball.speed = INITIAL_BALL_SPEED;
  ball.isStuck = true;
}

function updateBall(ball) {
  ball.x += ball.xVel;
  ball.y += ball.yVel;

  if (isBeyondEdges(ball)) {
    if (livesRemaining === 0) {
      gameOver = true;
    } else {
      livesRemaining--;
      resetBall(ball);
    }

  } else if (collisionExistsBetween(ball, leftPaddle) ||
             collisionExistsBetween(ball, rightPaddle)) {

    ball.speed++;
    score++;

    var rotation = randomNumberBetween(-Math.PI / 4, Math.PI / 4);
    var newVel = rotateVector({ x: ball.speed, y: 0 }, rotation);
    var sign = ball.xVel < 0 ? -1 : 1;

    ball.xVel = -sign * newVel.x;
    ball.yVel = newVel.y;

  } else if (hasCollidedWithWall(ball)) {
    ball.yVel = -ball.yVel;
  }
}

function tick() {
  if (!gameOver) {
    updatePaddle(leftPaddle);
    updatePaddle(rightPaddle);

    if (!ball.isStuck) {
      updateBall(ball);
    }
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

function drawTextCentered(ctx, text, x, y, fontHeight, fontName) {
  ctx.font = fontHeight + 'px ' + fontName;
  var textWidth = ctx.measureText(text).width;

  var actualX = x - (textWidth / 2);
  var actualY = y - (fontHeight / 2);

  ctx.fillText(text, actualX, actualY);
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  var color = 'white';

  drawRect(ctx, leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, color);
  drawRect(ctx, rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, color);
  drawCircle(ctx, ball.x, ball.y, BALL_RADIUS, color);

  ctx.font = '24px monospace';
  ctx.fillText("lives: " + livesRemaining, 0, 24);

  ctx.font = '24px monospace';
  ctx.fillText("score: " + score, CANVAS_WIDTH - 200, 24);

  if (gameOver) {
    drawTextCentered(ctx, 'GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2,
                     24, 'monospace');
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
