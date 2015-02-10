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