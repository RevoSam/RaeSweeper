document.oncontextmenu = function () { return false; }

var grid;
var gridLogic = [];
var cols;
var rows;
var w = 100;
var canvasDims = 100;
var totalBombs = 10;
var numberOfFlags = 0;
var flagpath = "Pictures/Flag.svg"

let timer = 0;
let bestTime = 0;
let wins = 0;
let totalclicks = 0;
let revealingclicks = 0;
let loses = 0;
let timerflag = false;
let myConvas;
let button;
let resetButton;
let buttonsDiv;
let difficulty;
let playableCells;

function preload() {
  heart = loadImage("Pictures/heart-like-svgrepo-com.svg");
  flagIcon = loadImage(flagpath);
}

function setup() {
  buttonsDiv = createDiv();
  buttonsDiv.attribute("ID", "buttons");
  statsDiv = createDiv();
  statsDiv.attribute("ID", "stats");

  timerSpan = createSpan("Timer: " + timer);
  besttimeSpan = createSpan("Best Time: " + bestTime + " s");
  stats = createSpan("Wins: [" + wins + "] - Losses:[" + loses + "]");
  timerSpan.addClass("button");
  stats.addClass("button");
  besttimeSpan.addClass("button");

  
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

  //timer = days;

  myConvas = createCanvas(canvasDims * 10 + 1, canvasDims * 10 + 1);

  button.parent("buttons");
  resetButton.parent("buttons");
  timerSpan.parent("buttons");
  stats.parent("stats");
  besttimeSpan.parent("stats");
  difficulty.parent("buttons");
  buttonsDiv.parent("body");
  statsDiv.parent("body");
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
    cursor(ARROW);
  } else {
    button.addClass("flagged");
    button.removeClass("notFlagged");
    flag = true;
    cursor(CROSS);
  }
}

function changeDifficulty() {
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

  totalBombs = floor((w ^ 2) / 10 + (canvasDims - w) * 3);
  

  resetGame()
}

function draw() {
    if (frameCount % 60 == 0 && timerflag) {
      timer++;
      timerSpan.html("Timer: " + timer + " s");
    }
    background(255);
    for (let index = 0; index < rows; index++) {
      for (let jndex = 0; jndex < cols; jndex++) {
        grid[index][jndex].show();
      }
    }
    cursor(ARROW);
  }

function mousePressed() {
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      if (grid[index][jndex].contains(mouseX, mouseY)) {
        totalclicks++;
        if (!timerflag)
          timerflag = true;
        if (flag)
        {
          if (grid[index][jndex].flag)
          {
            grid[index][jndex].flag = false;
            numberOfFlags++;
          }
          else{
            numberOfFlags--;
            if(numberOfFlags >= 0)
              {
                grid[index][jndex].flag = true;
              }
              else
                numberOfFlags = 0
          }
          playableCellsLeft();
          button.html("Flag[" + numberOfFlags + "]");
        }
        else {
          
          if(grid[index][jndex].flag)
          {
            grid[index][jndex].flag = false;
            numberOfFlags++;
          }
          grid[index][jndex].reveal();
          playableCellsLeft();
          button.html("Flag[" + numberOfFlags + "]");
          if (grid[index][jndex].bomb)
          {
            loses++;
            efficiency = floor((revealingclicks / totalclicks) * 100);
            gameOver("Game Over [" + efficiency + "%]! Do you want to play again?");
          }
          else
            revealingclicks++;
          if (playableCells == totalBombs)
          {
            wins++;
            efficiency = floor((revealingclicks / totalclicks) * 100);
            getBestTime();
            gameOver("You Won [" + efficiency + "%]! Do you want to play again?");
          }
            
        }
      }
    }
  }
}

function getBestTime(){
  if (bestTime == 0)
    bestTime = timer;
  else{
    bestTime = bestTime < timer ? bestTime : timer;
  }
}


function gameOver(text) {
  timerflag = false;
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].revealed = true;
    }
  }
  setTimeout(function() {
    answer = confirm(text);
    console.log(answer);   
    if (answer)                        
      resetGame();
  },500);
}



function playableCellsLeft(){
  playableCells = 0;
  for (let x = 0; x < rows; x++)
    {
      for (let y = 0; y < cols; y++)
      {
        if(!grid[x][y].revealed && grid[x][y].getNeighborCount()>0)
          playableCells++;
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

function showIndicesOfPlayableCells(){
  for (let x = 0; x < rows; x++)
    {
      for (let y = 0; y < cols; y++)
      {
        if(!grid[x][y].revealed && grid[x][y].getNeighborCount()>0)
          console.log("X: [" + x + "] | Y: [" + y + "]");
      }
    }
}

function resetGame() {

  button.addClass("notFlagged");
  button.removeClass("flagged");
  
  flag = false;
  timerflag = false;

  playableCells = 0;
  timer = 0;
  timerSpan.html("Timer: " + timer + " s");

  grid = create2D(rows, cols);

  for (let x = 0; x < rows; x++)
  {
    gridLogic[x] = [];
    for (let y = 0; y < cols; y++)
    {
      gridLogic[x][y] = 0;
    }
  }



  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex] = new Cell(index, jndex, w);
      gridLogic[index][jndex] = 0;
    }
  }
  var index = 0;
  while (index < totalBombs) {
    var i = floor(random(rows));
    var j = floor(random(cols));
    if (grid[i][j].bomb != true) {
      grid[i][j].bomb = true;
      gridLogic[j][i] = 'X';
      index++;
    }
  }
  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      grid[index][jndex].countNeighbors();
    }
  }

  for (let index = 0; index < rows; index++) {
    for (let jndex = 0; jndex < cols; jndex++) {
      if (!grid[index][jndex].bomb)
        gridLogic[jndex][index] = grid[index][jndex].getNeighborCount()
    }
  }

  let totalclicks = 0;
  let revealingclicks = 0;

  playableCellsLeft();
  numberOfFlags = totalBombs;
  button.html("Flag [" + numberOfFlags + "]");
  besttimeSpan.html("Best Time: " + bestTime + " s");
  stats.html("Wins: [" + wins + "] - Losses:[" + loses + "]");

  console.log(gridLogic);
}
