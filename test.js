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

	it('dead message', function() {
		expect(game1.player.location);
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
