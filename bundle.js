(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Dungeon = function() {
  this.rooms = [];
  this.pits = [];
};

Dungeon.prototype.addRm = function() {
  var roomId = this.rooms.length;
  this.rooms.push({
    id: roomId,
    adjacentRm1: null,
    adjacentRm2: null,
    nextLvlRm: null
  });
  return roomId;
};

Dungeon.prototype.buildLvl = function(size) {
  var level = [];
  var initialRmId = this.addRm();
  var prevRmId = initialRmId;
  level.push(initialRmId);
  for(var i = 0; i < size-1; i++) {
    var roomId = this.addRm();
    level.push(roomId);
    this.rooms[roomId].adjacentRm2 = prevRmId;
    this.rooms[prevRmId].adjacentRm1 = roomId;
    prevRmId = roomId;
  }
  this.rooms[initialRmId].adjacentRm2 = prevRmId;
  this.rooms[prevRmId].adjacentRm1 = initialRmId;
  return  level;
};

Dungeon.prototype.connectLvls = function(lvl1,lvl2) {
  // join levels at each room
  for(var i = 0; i < lvl1.length; i++) {
    this.rooms[lvl1[i]].nextLvlRm = lvl2[i];
    this.rooms[lvl2[i]].nextLvlRm = lvl1[i];
  }
};

Dungeon.prototype.randomRm = function() {
  return Math.ceil(Math.random() * (this.rooms.length - 1));
};

Dungeon.prototype.hidePits = function(numberOfPits) {
  for(var i = 0; i < numberOfPits; i++) {
    this.pits.push(this.randomRm());
  } 
};

module.exports = Dungeon;




},{}],2:[function(require,module,exports){
var Player = require('./player.js');
var Dungeon = require('./dungeon.js');
var Wumpus = require('./wumpus.js');

var Game = function() {
  this.player = new Player();
  this.dungeon = new Dungeon();
  this.wumpus = new Wumpus();
};

Game.prototype.start = function() {
  // builds two levels of five rooms. 
  this.dungeon.connectLvls(this.dungeon.buildLvl(5),this.dungeon.buildLvl(5));
  
  // sets location of the wumpus
  this.wumpus.location = this.dungeon.randomRm();

  // generates 3 pits
  this.dungeon.hidePits(3);
  return "dungeon built and wumpus exists";
};

Game.prototype.move = function() {
  var self = this;
  return {
    left: function() {
      self.player.location = self.dungeon.rooms[self.player.location].adjacentRm1;
      return "player moved left to room " + self.player.location;
    },
    right: function() {
      self.player.location = self.dungeon.rooms[self.player.location].adjacentRm2;
      return "player moved right to room " + self.player.location;
    },
    up: function() {
      if (self.player.location < self.dungeon.rooms[self.player.location].nextLvlRm) {
        self.player.location = self.dungeon.rooms[self.player.location].nextLvlRm;
        return "player changed levels and moved to room " + self.player.location;
      } else {
        return "player cannot go up. player is on highest level. try going down.";
      }
    },
    down: function() {
      if (self.player.location > self.dungeon.rooms[self.player.location].nextLvlRm) {
        self.player.location = self.dungeon.rooms[self.player.location].nextLvlRm;
        return "player changed levels and moved to room " + self.player.location;
      } else {
        return "player cannot go down. player is on lowest level. try going up.";
      }
    }
  };
};

Game.prototype.message = function() {
  var playerRm = this.dungeon.rooms[this.player.location];
  var wumpusLoc = this.wumpus.location;
  var pits = this.dungeon.pits;

  if (playerRm.id === wumpusLoc) {
    return "ran into the wumpus without a proper weapon. we're dead";
  } else if (playerRm.adjacentRm1 === wumpusLoc || playerRm.adjacentRm2 === wumpusLoc || playerRm.nextLvlRm === wumpusLoc)  {
    return "you smell that? we should watch out fo dat wumpus";
  } else if (pits.indexOf(playerRm.adjacentRm1) !== -1 || pits.indexOf(playerRm.adjacentRm2) !== -1 || pits.indexOf(playerRm.nextLvlRm) !== -1) {
    return "i pity the fool that falls into that pit";
  } else if (pits.indexOf(playerRm.id) !== -1) {
    return "dang, we the fool that fell into a pit";
  }

  return "smells fine to me";
};

module.exports = Game;



















},{"./dungeon.js":1,"./player.js":3,"./wumpus.js":5}],3:[function(require,module,exports){
var Player = function() {
  this.location = 0;
};

module.exports = Player;
},{}],4:[function(require,module,exports){
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
},{"./game.js":2}],5:[function(require,module,exports){
var Wumpus = function() {
	this.location = 0;
};

module.exports = Wumpus;
},{}]},{},[4]);
