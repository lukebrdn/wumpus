var Game = require('./game.js');

var View = function() {
  this.game = new Game();
};

View.prototype.display = function(character, className) {
  var roomNames = ['zero','one','two','three','four','five','six','seven','eight','nine'];
  var locationId = roomNames[character.location];

  if(document.getElementsByClassName(className).length > 0) {
    var divId = document.getElementsByClassName(className)[0].id;
    document.getElementById(divId).classList.remove(className);
  }
  document.getElementById(locationId).classList.add(className);
};

View.prototype.displayMessage = function() {
  var messageArea = document.getElementById('message-area');
  messageArea.innerHTML = this.game.message();
};

View.prototype.keyHandler = function(e) {
    if (e.keyCode === 37) {
      this.game.move().left();
      this.display(this.game.player, 'hunter');
      this.displayMessage();
  }
  if (e.keyCode === 38) {
      this.game.move().up();
      this.display(this.game.player, 'hunter');
      this.displayMessage();
  }
  if (e.keyCode === 39) {
      this.game.move().right();
      this.display(this.game.player, 'hunter');
      this.displayMessage();
  }
  if (e.keyCode === 40) {
      this.game.move().down();
      this.display(this.game.player, 'hunter');
      this.displayMessage();
  }
};

var wumpus = new View;
wumpus.game.start();
wumpus.display(wumpus.game.player, 'hunter');
wumpus.display(wumpus.game.wumpus, 'wumpus');
wumpus.displayMessage();

document.onkeydown = function(e) {
  wumpus.keyHandler(e);
};