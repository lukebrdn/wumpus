var Player = require('./player.js');
var Dungeon = require('./dungeon.js');
var Wumpus = require('./wumpus.js');

var Game = function() {
      this.player = new Player();
      this.dungeon = new Dungeon();
      this.wumpus = new Wumpus();
      this.started = false;
    };

Game.prototype.start = function() {
                if(this.started) { 
                  return "already started";
                }
                this.started = true;

                var d = this.dungeon;
                var w = this.wumpus;

                // builds two levels of five rooms. 
                d.connectLvls(d.buildLvl(5),d.buildLvl(5));

                // sets location of the wumpus
                this.hideWumpus();

                // generates 2 pits
                this.hidePits(2);
                return "dungeon built and wumpus exists";
              };

Game.prototype.hideWumpus = function() {
                var w = this.wumpus;

                // sets location of the wumpus
                w.location = this.randomRm();
                this.dungeon.rooms[w.location].wumpus = true;
              };

Game.prototype.hidePits = function(numberOfPits) {
                var rooms = this.dungeon.rooms;
                var pits = this.dungeon.pits;
                
                for(var i = 0; i < numberOfPits; i++) {
                  var roomId = this.randomRm(this.wumpus.location);

                  // make sure pits do not overlap
                  while(pits.indexOf(roomId) !== -1) {
                    roomId = this.randomRm(this.wumpus.location);
                  }

                  pits.push(roomId);
                  rooms[roomId].pit = true;
                } 
              };

Game.prototype.randomRm = function(roomToExlude) {
                var room = Math.ceil(Math.random() * (this.dungeon.rooms.length - 1));
                while(room === roomToExlude) {
                  room = Math.ceil(Math.random() * (this.dungeon.rooms.length - 1));
                }
                return room;
              };

Game.prototype.move = function() {
                var p = this.player;
                var rooms = this.dungeon.rooms;

                return {
                  left: function() {
                    p.location = rooms[p.location].adjacentRm1;
                  },
                  right: function() {
                    p.location = rooms[p.location].adjacentRm2;
                  },
                  up: function() {
                    if (p.location < rooms[p.location].nextLvlRm) {
                      p.location = rooms[p.location].nextLvlRm;
                    }
                  },
                  down: function() {
                    if (p.location > rooms[p.location].nextLvlRm) {
                      p.location = rooms[p.location].nextLvlRm;
                    }
                  }
                };
              };

Game.prototype.doesPlayerDie = function() {
                var p = this.player;
                var w = this.wumpus;
                var pits = this.dungeon.pits;

                // killed by the wumpus
                if(p.location === w.location) {
                  p.dead = true;
                  return 1;
                }
                // fell into a pit
                if(pits.indexOf(p.location) !== -1) {
                  p.dead = true;
                  return 2;
                }

                return 0;

              };

Game.prototype.arePitsNearby = function() {
                var p = this.player;
                var rooms = this.dungeon.rooms;
                var pits = this.dungeon.pits;

                if(pits.indexOf(rooms[p.location].adjacentRm1) !== -1) {
                  return true;
                }
                if(pits.indexOf(rooms[p.location].adjacentRm2) !== -1) {
                  return true;
                }
                if(pits.indexOf(rooms[p.location].nextLvlRm) !== -1) {
                  return true;
                }

                return false;

              };

Game.prototype.isWumpusNearby = function() {
                var p = this.player;
                var w = this.wumpus;
                var rooms = this.dungeon.rooms;

                if(rooms[p.location].adjacentRm1 === w.location) {
                  return true;
                }
                if(rooms[p.location].adjacentRm2 === w.location) {
                  return true;
                }
                if(rooms[p.location].nextLvlRm === w.location) {
                  return true;
                }

                return false;

              };


module.exports = Game;
