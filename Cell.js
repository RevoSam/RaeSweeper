function Cell(i, j, w){
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.bomb = false;
    
    this.revealed = false;
    this.neighborCount = 0;
  }

  Cell.prototype.show = function(){
    if (this.revealed)
    {   
        if (this.bomb)
        {
            fill(100);
            ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, + this.w * 0.5);
        }
        else{
            fill(200);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0)
            {
                textAlign(CENTER);
                fill(0);
                text(this.neighborCount, this.x + this.w*0.5, this.y + this.w*0.75);
            }
        }
    }
    noFill();
    rect(this.x, this.y, this.w, this.w);
  }

  Cell.prototype.contains = function (x, y){
      return x > this.x && x < (this.x + this.w) && y > this.y && y < this.y + this.w;
  }

  Cell.prototype.reveal = function()
  {
    this.revealed = true;  
    if (this.neighborCount == 0 && !this.bomb)
      {
          this.showBlank();
      }
      
  }

  Cell.prototype.showBlank = function()
  {
    for(var i = -1; i <= 1; i++)
    {
        for (var j = -1; j <= 1; j++)
        {
            if ((this.i + i ) > -1 && (this.i + i) < rows && (this.j + j > -1) && (this.j+j<cols))
            {
                var neighbor = grid[this.i + i][this.j + j];
                if (!neighbor.bomb && !neighbor.revealed)
                    neighbor.reveal();
            }
                
        }
    }
  }

  Cell.prototype.countNeighbors = function(){
    // if (this.bomb)
    //     return -1;
    var total = 0;
    
    for(var i = -1; i <= 1; i++)
    {
        for (var j = -1; j <= 1; j++)
        {
            if ((this.i + i ) > -1 && (this.i + i) < rows && (this.j + j > -1) && (this.j+j<cols))
            {
                var neighbor = grid[this.i + i][this.j + j];
                if (neighbor.bomb)
                    total++;
            }
                
        }
    }
    this.neighborCount = total;
  }