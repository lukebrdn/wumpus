var dungeon = require('./dungeon.js');
var Game = require('./game.js');

describe("Wompus tests", function() {

	var game1 = new Game();
	game1.start();
	
	it('player start location', function() {
		expect(game1.player.location).toBe(0);
	});

	it('wumpus start location', function() {
		expect(game1.wumpus.location > 0 && game1.wumpus.location < game1.dungeon.rooms.length).toBe(true);
	});

	it('rooms have adjacentRm1', function() {
		var rooms = game1.dungeon.rooms;
		
		function hasAdjRm(room, index, rooms) {
			return room.hasOwnProperty('adjacentRm1');
		}

		expect(rooms.every(hasAdjRm)).toBe(true);

	});

	it('rooms have adjacentRm2', function() {
		var rooms = game1.dungeon.rooms;
		
		function hasAdjRm(room, index, rooms) {
			return room.hasOwnProperty('adjacentRm2');
		}

		expect(rooms.every(hasAdjRm)).toBe(true);

	});

	it('rooms have nextLvlRm', function() {
		var rooms = game1.dungeon.rooms;
		
		function hasNxtLvl(room, index, rooms) {
			return room.hasOwnProperty('nextLvlRm');
		}

		expect(rooms.every(hasNxtLvl)).toBe(true);

	});
	
	it('nextLvl rooms are joined to each other', function() {
		var rooms = game1.dungeon.rooms;
		
		function rmsJoined(room, index, rooms) {
			return room.id === rooms[room.nextLvlRm].nextLvlRm;
		}

		expect(rooms.every(rmsJoined)).toBe(true);
	});

	it('pits hidden', function() {
		var rooms = game1.dungeon.rooms;
		game1.hidePits();

		
		function pitCount() {
			var count = 0;
			rooms.forEach(function(room) {
				if(room.pit === true) {
					count++;
				}
			});
			return count;
		}

		expect(pitCount()).toBe(game1.pitCount);
	});

	it('player move left', function() {
		var roomId = game1.player.location;
		game1.move().left();
		expect(game1.player.location).toBe((roomId + 1) % game1.dungeon.rooms.length);
	});

	it('player move right', function() {
		var roomId = game1.player.location;
		game1.move().right();
		expect(game1.player.location).toBe((roomId - 1) % game1.dungeon.rooms.length);
	});


	// xit("moves left", function() {
	// 	var callback = jasmine.createSpy("callback");
	// 	var game = makeGame(callback);
	// 	game.start();
	// 	game.moveLeft();
	// 	expect(game.hunter.currentRoom).toBe(1);
	// 	expect(callback).toHaveBeenCalledWith(jasmine.objectContaining(game));
	// });

	// Todo at least 3 more unit tests 
});
