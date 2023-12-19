document.oncontextmenu = function() { return false; }

var grid;
var cols;
var rows;
var w = 100;
var canvasDims = 100;
var totalBombs = 10;

let timer = 0;
let days, months, years;
let flag = false;
let myConvas;
let button;
let resetButton;
let buttonsDiv;
let difficulty;

function preload() {
  heart = loadImage("Pictures/heart-like-svgrepo-com.svg");
  flagIcon = loadImage("Pictures/Flag.svg");
}

function setup() {
  let flag = false;
  let birthday = new Date(year(Date.now()), 5, 14);
  buttonsDiv = createDiv();
  buttonsDiv.attribute("ID", "buttons");
  button = createButton("Flag");
  resetButton = createButton("Reset");
  button.mousePressed(FlagTime);
  resetButton.mousePressed(resetGame);
  button.addClass("button");
  button.addClass("notFlagged");
  resetButton.addClass("button");
  resetButton.attribute("ID", "reset");
  difficulty = createSelect();
  difficulty.addClass("select")
  difficulty.option('Easy');
  difficulty.option('Normal');
  difficulty.option('Hard');
  difficulty.option('Expert');
  difficulty.changed(changeDifficulty)

  let current = new Date();

  days = Math.ceil(Math.abs(birthday - current) / (1000 * 60 * 60 * 24));
  //timer = days;

  myConvas = createCanvas(canvasDims * 10 + 1, canvasDims * 10 + 1);

  button.parent("buttons");
  resetButton.parent("buttons");
  difficulty.parent("buttons");
  buttonsDiv.parent("body");
  myConvas.parent("body");

  cols = floor(width / w);
  rows = floor(height / w);

  //totalBombs = rows;

  grid = create2D(rows, cols);

  resetGame();
}

function FlagTime() {
  if (flag) {
    button.addClass("notFlagged");
    button.removeClass("flagged");
    flag = false;
  } else {
    button.addClass("flagged");
    button.removeClass("notFlagged");
    flag = true;
  }
}

function changeDifficulty()
{
  let difficultyOption = difficulty.value();

  if (difficultyOption == 'Easy')
    w = 100;
  if (difficultyOption == 'Normal')
    w = 75;
  if (difficultyOption == 'Hard')
    w = 50;
  if (difficultyOption == 'Expert')
    w = 25;
  
  cols = floor(width / w);
  rows = floor(height / w);

  totalBombs = floor((w^2)/10 + (canvasDims - w)*3);

  resetGame()
}

function draw() {
  if (timer > 0) {
    background(120);
    textAlign(CENTER, CENTER);
    textSize(100);
    text(timer, width / 2, height / 2);
    if (frameCount % 60 == 0 && timer > 0) {
      // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer--;
    }
  } else {
    background(255);
    for (let index = 0; index < rows; index++) {
      for (let jndex = 0; jndex < cols; jndex++) {
        grid[index][jndex].show();
      }
    }
  }
}

function mousePressed() {
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      if (grid[index][jndex].contains(mouseX, mouseY)) {
        if (mouseButton == RIGHT)
          grid[index][jndex].flag = true;
        else
        {
          grid[index][jndex].flag = false;
          grid[index][jndex].reveal();
          if (grid[index][jndex].bomb) gameOver();
        }
          
        // if (flag) {
        //   grid[index][jndex].flag = true;
        // } else {
        //   grid[index][jndex].flag = false;
        //   grid[index][jndex].reveal();
        //   if (grid[index][jndex].bomb) gameOver();
        // }
      }
    }
  }
}

function gameOver() {
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].revealed = true;
    }
  }
}

function create2D(rows, cols) {
  var arr = new Array(rows);
  for (let index = 0; index < arr.length; index++) {
    arr[index] = new Array(cols);
  }
  return arr;
}

function resetGame() {
  button.addClass("notFlagged");
  button.removeClass("flagged");
  flag = false;
  
  grid = create2D(rows, cols);

  console.log("Total Number of Bombs: " + totalBombs);

  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex] = new Cell(index, jndex, w);
    }
  }
  var index = 0;
  while (index < totalBombs) {
    var i = floor(random(rows));
    var j = floor(random(cols));
    if (grid[i][j].bomb != true) {
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
