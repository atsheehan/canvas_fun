function clearScreen(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawRect(context, x, y, w, h, color) {
  context.strokeStyle = color;
  context.fillStyle = color;

  context.fillRect(x, y, w, h);
}

function drawTextCentered(context, text, x, y, fontHeight, fontName) {
  context.font = fontHeight + 'px ' + fontName;
  var textWidth = context.measureText(text).width;

  var actualX = x - (textWidth / 2);
  var actualY = y - (fontHeight / 2);

  context.fillText(text, actualX, actualY);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
