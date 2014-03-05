var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = context.canvas.width;
var CANVAS_HEIGHT = context.canvas.height;

var COLUMNS = 10;
var ROWS = 20;
var PADDING = 4;

var BLOCK_SIZE = CANVAS_HEIGHT / (ROWS + PADDING);

var GRID_WIDTH = BLOCK_SIZE * COLUMNS;
var GRID_HEIGHT = BLOCK_SIZE * ROWS;

var GRID_X = (CANVAS_WIDTH - GRID_WIDTH) / 2;
var GRID_Y = (CANVAS_HEIGHT - GRID_HEIGHT) / 2;

function moveShapeLeft(game) {
  game.currentShape.x--;
}

function moveShapeRight(game) {
  game.currentShape.x++;
}

function moveShapeDown(game) {
  game.currentShape.y++;
}

function keyDown(game, event) {
  var handled = true;

  switch (event.keyCode) {
  case LEFT_KEY: moveShapeLeft(game); break;
  case RIGHT_KEY: moveShapeRight(game); break;
  case DOWN_KEY: moveShapeDown(game); break;
  default: handled = false; break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function tick(game) {
}

function draw(game) {
  clearScreen(context);
  drawRect(context, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'green');
  drawRect(context, GRID_X, GRID_Y, GRID_WIDTH, GRID_HEIGHT, 'black');

  if (game.currentShape !== null) {
    var shape = game.currentShape;
    var blocks = SHAPES[shape.index][shape.rotation];

    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i] !== 0) {
        var row = shape.y + Math.floor(i / SHAPE_LENGTH);
        var col = shape.x + (i % SHAPE_LENGTH);

        var x = GRID_X + (col * BLOCK_SIZE);
        var y = GRID_Y + (row * BLOCK_SIZE);

        drawRect(context, x, y, BLOCK_SIZE, BLOCK_SIZE, 'blue');
      }
    }
  }
}

function loop(game, time) {
  tick(game);
  draw(game);

  window.requestAnimationFrame(function(time) {
    loop(game, time);
  });
}

function run() {
  var game = {
    currentShape: { x: 0, y: 0, index: 0, rotation: 0 }
  };

  window.onkeydown = function(event) {
    keyDown(game, event);
  };

  window.requestAnimationFrame(function(time) {
    loop(game, time);
  });
}

run();
