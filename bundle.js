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
                      nextLvlRm: null,
                      wumpus: false,
                      pit: false,
                      sword: false
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
                    var rooms = this.rooms;

                    // join levels at each room
                    for(var i = 0; i < lvl1.length; i++) {
                      rooms[lvl1[i]].nextLvlRm = lvl2[i];
                      rooms[lvl2[i]].nextLvlRm = lvl1[i];
                    }
                  };

Dungeon.prototype.randomRm = function() {
                    return Math.ceil(Math.random() * (this.rooms.length - 1));
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
      this.started = false;
    };

Game.prototype.start = function() {
                if(this.started) { 
                  return "already started";
                }
                this.started = true;

                var d = this.dungeon;

                // builds two levels of five rooms. 
                d.connectLvls(d.buildLvl(7),d.buildLvl(7));

                // sets location of the wumpus
                this.hideWumpus();

                // generates 2 pits
                this.hidePits(2);

                // hides sword
                this.hideSword();
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

Game.prototype.hideSword = function() {
                var w = this.wumpus;
                var rooms = this.dungeon.rooms;
                var swordRoom = this.randomRm(this.wumpus.location);
                
                while (rooms[swordRoom].pit || rooms[swordRoom].wumpus) {
                  swordRoom = this.randomRm(w.location);
                }

                rooms[swordRoom].sword = true;
                return rooms[swordRoom];
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

                var self = this;

                return {
                  left: function() {
                    p.location = rooms[p.location].adjacentRm1;
                    self.isSwordInRoom();
                  },
                  right: function() {
                    p.location = rooms[p.location].adjacentRm2;
                    self.isSwordInRoom();
                  },
                  up: function() {
                    if (p.location < rooms[p.location].nextLvlRm) {
                      p.location = rooms[p.location].nextLvlRm;
                      self.isSwordInRoom();
                    }
                  },
                  down: function() {
                    if (p.location > rooms[p.location].nextLvlRm) {
                      p.location = rooms[p.location].nextLvlRm;
                      self.isSwordInRoom();
                    }
                  }
                };
              };

Game.prototype.isPlayerDead = function() {
                var p = this.player;
                var w = this.wumpus;
                var pits = this.dungeon.pits;

                // same room as the wumpus
                if(p.location === w.location) {
                  if(p.hasSword) {
                    return false;
                  }
                  p.dead = true;
                  return true;
                }

                // player dies if same room as the pit
                if(pits.indexOf(p.location) !== -1) {
                  p.dead = true;
                  return true;
                }

                return false;
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

Game.prototype.isSwordInRoom = function() {
                var p = this.player;
                var rooms = this.dungeon.rooms;  
                
                if(rooms[p.location].sword) {
                  p.hasSword = true;
                  return true;
                } else {
                  return false;
                }

              };


module.exports = Game;

},{"./dungeon.js":1,"./player.js":3,"./wumpus.js":5}],3:[function(require,module,exports){
var Player = function() {
	this.location = 0;
	this.hasSword = false;
	this.dead = false;
};

module.exports = Player;
},{}],4:[function(require,module,exports){
var Game = require('./game.js');

var View = function() {
  this.game = new Game();
};

/*
 * Loops must be passed in from the outermost loop to the innermost loop.*
 */
View.prototype.roomsToNodes = function(radius, difference, rooms) { 
                var nodes = [];
                var loops = [];

                for (var i = 0; i < rooms.length; i++) {
                    var room = rooms[i];
                    if (room.id >= (rooms.length/2)) {
                        (loops[0] = loops[0] || []).push(room);
                    } else {
                        (loops[1] = loops[1] || []).push(room);
                    }
                }

                for (var i = 0; i < loops.length; i++) {
                    var loop   = loops[i],
                        scale  = 360 / loops[i].length,
                        newRadius = radius - i * difference;

                    for (var j = 0; j < loop.length; j++) {
                        var pos     = (j * scale) % 360
                            radians = pos * (Math.PI / 180);
                        nodes.push({
                            x : newRadius * Math.cos(radians),
                            y : newRadius * Math.sin(radians),
                            id : loop[j].id,
                            left : loop[j].adjacentRm1,
                            right : loop[j].adjacentRm2,
                            forward : loop[j].nextLvlRm
                        });
                    }
                }
                return nodes;
            };

View.prototype.drawGraph = function(selector, game) {
                var w = 500,
                    h = 500;

                var nodes = this.roomsToNodes(200, 100, this.game.dungeon.rooms);

                var graph = d3.select(selector)
                              .append("svg");

                graph.attr("width", w)
                   .attr("height", h)
                   .text("Our Graph")
                   .select(selector);

                graph.selectAll("circle.nodes")
                     .data(nodes)
                     .enter()
                     .append("svg:circle")
                     .attr("cx", function(d) { return d.x + w/2; })
                     .attr("cy", function(d) { return d.y + h/2; });

                graph.selectAll("circle.nodes")
                     .data(nodes)
                     .enter()
                     .append("svg:circle")
                     .attr("cx", function(d) { return d.x + w/2; })
                     .attr("cy", function(d) { return d.y + h/2; })
                     .attr("r", "20px")
                     .style("stroke", "black")     
                     .style("stroke-width", 0.25)
                     .style("fill", function(node) { 
                         if (game.player.location === node.id) {
                             return "url(#toon)";
                         } else {
                             return "transparent";
                         }
                     });

                var links = nodes.sort(function(a, b) {
                    if (a.id > b.id) {
                        return 1;
                    } else if (a.id < b.id) {
                        return -1;
                    }
                    return 0;
                });

                graph.selectAll(".line")
                     .data(links)
                     .enter()
                     .append("line")
                     .attr("x1", function(d) { return d.x + w/2; })
                     .attr("y1", function(d) { return d.y + h/2; })
                     .attr("x2", function(d) { return links[d.left].x + w/2; })
                     .attr("y2", function(d) { return links[d.left].y + h/2; })
                     .style("stroke", "rgb(6,120,155)");

                graph.selectAll(".line")
                     .data(links)
                     .enter()
                     .append("line")
                     .attr("x1", function(d) { return d.x + w/2; })
                     .attr("y1", function(d) { return d.y + h/2; })
                     .attr("x2", function(d) { return links[d.right].x + w/2; })
                     .attr("y2", function(d) { return links[d.right].y + h/2; })
                     .style("stroke", "rgb(6,120,155)");

                graph.selectAll(".line")
                     .data(links)
                     .enter()
                     .append("line")
                     .attr("x1", function(d) { return d.x + w/2; })
                     .attr("y1", function(d) { return d.y + h/2; })
                     .attr("x2", function(d) { return links[d.forward].x + w/2; })
                     .attr("y2", function(d) { return links[d.forward].y + h/2; })
                     .style("stroke", "rgb(6,120,155)");
            };

View.prototype.displayMessage = function() {
                var messageArea = document.getElementById('message-area');
                messageArea.innerHTML = this.message();
            };

View.prototype.message = function() {
                var message = "Mr. T says:";
                
                var count = 0;
                if(this.game.isSwordInRoom()) {
                    message += " We found the sword. Let's get that wumpus.";
                    count++;
                }

                if(this.game.arePitsNearby()) {
                    message += " There's a pit nearby. Watch out fool.";
                    count++;
                }

                if(this.game.isWumpusNearby()) {
                    message += " I smell a wumpus. I hope you brought your sword.";
                    count++;
                }

                if(this.game.isPlayerDead()) {
                    message += " Dang, we're dead fool.";
                    count++;
                }

                if(this.game.player.location === this.game.wumpus.location) {
                    if(this.game.player.hasSword) {
                        message = "Mr. T says: That's one dead wumpus.";
                        count++;
                    } else {
                        messsage += " We should have brought a sword."
                        count++;
                    }
                }

                if(count === 0) {
                    message += " We're safe, for now.";
                }

                return message;
            };

View.prototype.keyHandler = function(e) {
                if (e.keyCode === 37) {
                    this.game.move().left();
                    this.displayMessage();

                    // removes previous graph, then draws new graph
                    d3.select("#graph").select('svg').remove();
                    this.drawGraph("#graph", this.game);
                }

                if (e.keyCode === 38) {
                    this.game.move().up();
                    this.displayMessage();

                    // removes previous graph, then draws new graph
                    d3.select("#graph").select('svg').remove();
                    this.drawGraph("#graph", this.game);
                }

                if (e.keyCode === 39) {
                    this.game.move().right();
                    this.displayMessage();
                    
                    // removes previous graph, then draws new graph
                    d3.select("#graph").select('svg').remove();
                    this.drawGraph("#graph", this.game);
                }

                if (e.keyCode === 40) {
                    this.game.move().down();
                    this.displayMessage();
                    
                    // removes previous graph, then draws new graph
                    d3.select("#graph").select('svg').remove();
                    this.drawGraph("#graph", this.game);
                }
            };

var wumpus = new View();
wumpus.game.start();
wumpus.drawGraph("#graph", wumpus.game);
wumpus.displayMessage();
console.log(wumpus.game.dungeon.rooms, wumpus.game.player);

document.onkeydown = function(e) {
            wumpus.keyHandler(e);
        };
},{"./game.js":2}],5:[function(require,module,exports){
var Wumpus = function() {
	this.location = 1;
};

module.exports = Wumpus;
},{}]},{},[4]);
