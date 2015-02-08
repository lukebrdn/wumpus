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