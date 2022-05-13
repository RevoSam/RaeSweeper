
var grid;
var cols;
var rows;
var w = 50;
var totalBombs = 15;

let timer = 0;
let days, months, years;
let flag = false;
let myConvas;
let button;
let resetButton;
let buttonsDiv;

function preload()
{
  heart = loadImage('Pictures/Love.svg');
  flagIcon = loadImage('Pictures/Flag.svg');
}

function setup() {
  let flag = false;
  let birthday = new Date(2022, 5, 14);
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
  
  let current = new Date();

  days = Math.ceil((Math.abs(birthday - current)/ (1000 * 60 * 60 * 24)));
  //timer = Math.ceil((Math.abs(birthday - current)) / (1000 * 60));


  myConvas = createCanvas(w*10+1, w*10+1);

  button.parent("buttons");
  resetButton.parent("buttons");
  buttonsDiv.parent("body");
  myConvas.parent("body");
  
  
  
  cols = floor(width/w);
  rows = floor(height/w);
  grid = create2D(rows, cols);

  resetGame();
  
}

function FlagTime()
{
  if (flag)
  {
    button.addClass("notFlagged");
    button.removeClass("flagged");
    flag = false;
  }
    
  else
  {
    button.addClass("flagged");
    button.removeClass("notFlagged");
    flag = true;
  }
}

function draw() {
  if (timer > 0)
  {
    background(220);
    textAlign(CENTER, CENTER);
    textSize(100);
    text(timer, width/2, height/2);
    if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer --;
    }
  }
  else{
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
      if (grid[index][jndex].contains(mouseX, mouseY))
      {
        if (flag)
        {
          grid[index][jndex].flag = true;
        }
        else
        {
          grid[index][jndex].flag = false;
          grid[index][jndex].reveal();
          if (grid[index][jndex].bomb)
            gameOver();
        }
        
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

function resetGame()
{
  flag = false;
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
