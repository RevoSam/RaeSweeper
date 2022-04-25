var grid;
var cols;
var rows;
var w = 20;
var totalBombs = 10;

function setup() {
  createCanvas(201, 201);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = create2D(rows, cols);
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex] = new Cell(index, jndex, w);
    }
  }
  var index = 0;
  while (index < totalBombs) {
    var i = floor(random(rows));
    var j = floor(random(cols));
    if (grid[i][j].bomb != true)
    {
      grid[i][j].bomb = true;
      index++;
    }
    
  }
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].countNeighbors();
    }
  }
}

function draw() {
  background(255);
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].show();
    }
  }
}

function mousePressed() {
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      if (grid[index][jndex].contains(mouseX, mouseY))
      {
        grid[index][jndex].reveal();
        if (grid[index][jndex].bomb)
          gameOver();
      }
    }
  }
}

function gameOver()
{
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].revealed = true;
    }
  }
}

function create2D(rows, cols)
{
  var arr = new Array(rows);
  for (let index = 0; index < arr.length; index++) {
    arr[index] = new Array(cols);
  }
  return arr;
}


