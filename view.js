var Game = require('./game.js');

var View = function() {
  this.game = new Game();
};

View.prototype.display = function() {
  var roomNames = ['zero','one','two','three','four','five','six','seven','eight','nine'];
  var locationId = roomNames[this.game.player.location];

  if(document.getElementsByClassName('hunter').length > 0) {
    var divId = document.getElementsByClassName('hunter')[0].id;
    document.getElementById(divId).classList.remove('hunter');
  }
  document.getElementById(locationId).classList.add('hunter');
};

View.prototype.keyHandler = function(e) {
    if (e.keyCode === 37) {
      this.game.move().left();
      this.display();
  }
  if (e.keyCode === 38) {
      this.game.move().up();
      this.display();
  }
  if (e.keyCode === 39) {
      this.game.move().right();
      this.display();
  }
  if (e.keyCode === 40) {
      this.game.move().down();
      this.display();
  }
};

var wumpus = new View;
wumpus.game.start();
wumpus.display();

document.onkeydown = function(e) {
  wumpus.keyHandler(e);
};