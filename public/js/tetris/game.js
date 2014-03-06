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

function generateRandomShape() {
  var shapeIndex = getRandomInt(0, SHAPES.length - 1);
  var rotationIndex = 0;
  var blocks = SHAPES[shapeIndex][rotationIndex];

  var x = (COLUMNS - blocks.length) / 2;
  var y = 0;

  return {
    x: x,
    y: y,
    blocks: blocks,
    rotation: rotationIndex,
    index: shapeIndex
  };
}

function moveShapeLeft(game) {
  game.currentShape.x--;
}

function moveShapeRight(game) {
  game.currentShape.x++;
}

function attachShapeToGrid(shape, grid) {
  for (var row = 0; row < shape.blocks.length; row++) {
    for (var col = 0; col < shape.blocks[row].length; col++) {

      if (shape.blocks[row][col] !== 0) {
        grid[shape.y + row][shape.x + col] = shape.blocks[row][col];
      }
    }
  }
}

function hasCollided(shape, grid) {
  for (var row = 0; row < shape.blocks.length; row++) {
    for (var col = 0; col < shape.blocks[row].length; col++) {
      if (shape.blocks[row][col] !== 0) {
        if (shape.y + row >= ROWS ||
            shape.x + col > COLUMNS ||
            shape.x + col < 0 ||
            grid[shape.y + row][shape.x + col] !== 0) {

          return true;
        }
      }
    }
  }

  return false;
}

function clearRow(grid, rowIndexToClear) {
  for (var row = rowIndexToClear; row > 0; row--) {
    grid[row] = grid[row - 1];
  }

  grid[0] = []
  for (var col = 0; col < COLUMNS; col++) {
    grid[0][col] = 0;
  }
}

function checkForFullRows(grid) {
  for (var rowIndex = 1; rowIndex < grid.length; rowIndex++) {
    var row = grid[rowIndex];
    var emptyCellFound = false;

    for (var col = 0; col < row.length; col++) {
      if (row[col] == 0) {
        emptyCellFound = true;
        break;
      }
    }

    if (!emptyCellFound) {
      clearRow(grid, rowIndex);
    }
  }
}

function moveShapeDown(game) {
  game.currentShape.y++;
  if (hasCollided(game.currentShape, game.grid)) {
    game.currentShape.y--;

    attachShapeToGrid(game.currentShape, game.grid);
    checkForFullRows(game.grid);
    game.currentShape = generateRandomShape();
  }
}

function rotateShape(game) {
  var shape = game.currentShape;

  shape.rotation++;

  if (shape.rotation >= 4) {
    shape.rotation = 0;
  }
}

function keyDown(game, event) {
  var handled = true;

  switch (event.keyCode) {
  case LEFT_KEY: moveShapeLeft(game); break;
  case RIGHT_KEY: moveShapeRight(game); break;
  case DOWN_KEY: moveShapeDown(game); break;
  case UP_KEY: rotateShape(game); break;
  default: handled = false; break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function tick(game) {
  game.dropCounter--;

  if (game.dropCounter < 0) {
    moveShapeDown(game);
    game.dropCounter = 60;
  }
}

function draw(game) {
  clearScreen(context);
  drawRect(context, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'green');
  drawRect(context, GRID_X, GRID_Y, GRID_WIDTH, GRID_HEIGHT, 'black');

  if (game.currentShape !== null) {
    var shape = game.currentShape;

    for (var row = 0; row < shape.blocks.length; row++) {
      for (var col = 0; col < shape.blocks[row].length; col++) {
        if (shape.blocks[row][col] !== 0) {

          var x = GRID_X + ((shape.x + col) * BLOCK_SIZE);
          var y = GRID_Y + ((shape.y + row) * BLOCK_SIZE);

          drawRect(context, x, y, BLOCK_SIZE, BLOCK_SIZE, 'blue');
        }
      }
    }
  }

  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLUMNS; col++) {
      if (game.grid[row][col] !== 0) {
        var x = GRID_X + (col * BLOCK_SIZE);
        var y = GRID_Y + (row * BLOCK_SIZE);

        drawRect(context, x, y, BLOCK_SIZE, BLOCK_SIZE, 'red');
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

function generateGrid() {
  var grid = [];

  for (var row = 0; row < ROWS; row++) {
    grid[row] = [];

    for (var col = 0; col < COLUMNS; col++) {
      grid[row][col] = 0;
    }
  }

  return grid;
}

function run() {
  var game = {
    grid: generateGrid(),
    currentShape: generateRandomShape(),
    dropCounter: 60
  };

  window.onkeydown = function(event) {
    keyDown(game, event);
  };

  window.requestAnimationFrame(function(time) {
    loop(game, time);
  });
}

run();
