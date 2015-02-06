var Player = require('./player.js');
var Dungeon = require('./dungeon.js');

var Game = function() {
  this.player = new Player();
  this.dungeon = new Dungeon();
};

Game.prototype.start = function() {
  this.dungeon.connectLvls(this.dungeon.buildLvl(5),this.dungeon.buildLvl(5));
  return "dungeon built";
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

module.exports = Game;