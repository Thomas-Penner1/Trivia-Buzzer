// A class to keep track of the games that we are using
// Fields of a Game object:
//  id:      uuid

const GameStatus = require("../enums/gameStatus");

//  players: [Player]
class Game {
    constructor(id) {
        this.id = id;
        this.isOpen = false;
        this.players = [];
        this.status = GameStatus.Pending;
    }

    // Returns a boolean indicating whether or not this task was successful
    // NOTE: only ready games can accept new players
    addPlayer(player) {
        if (this.isOpen && this.status === GameStatus.Ready) {
            this.players.push(player);
            return true;
        }

        return false;
    }

    // Removes a player based on their player id. If the player id does not exist,
    // then this method does nothing
    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id != playerId);
    }

    // Returns a boolean indicating whether or not this task was successful
    setUsername(player_id, username) {
        let player = this.players.find(obj => {
            return obj.id === player_id;
        });

        // Player with matching id does not exist
        if (player === undefined) {
            return false;
        }

        // Player with username already exists
        if (this.players.find(obj => {obj.username === username})) {
            return false;
        }

        return player.setUsername(username);
    }

    // NOTE: open and closing rooms only does something if the game is ready
    closeRoom() {
        this.isOpen = false;
    }

    openRoom() {
        this.isOpen = true;
    }

    // Changes the game state from pending to ready
    makeReady() {
        this.status = GameStatus.Ready;
        this.isOpen = true;
    }

    // Starts the game from the game's perspective
    startGame() {
        this.status = GameStatus.Active;
    }
}

module.exports = Game;