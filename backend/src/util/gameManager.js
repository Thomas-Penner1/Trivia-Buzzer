// const GameWS = require("../classes/game-ws")

const Game = require("../classes/game");
const { generateRoomPassword } = require("./buzzerUtil");

// A simple library to build and manage games. This will essentially hide a lot of
// the implementation details from the other files :)

let Games = new Map();
let Passcodes = new Map();


// This is what is going to be handling most of the requests
var GameManager = {
    /*
     * Creates a new game, and adds it to the games mapping
     */
    createGame: function(room_id, host_id) {
        let passcode = generateRoomPassword();
        let newGame = new Game(room_id, host_id, passcode);

        Games.set(room_id, newGame);
        Passcodes.set(passcode, room_id);
    },

    /*
     * Creates the mapping allowing for a password to be mapped to a game. This
     * will allow users to join rooms later :)
     */
    addPassword: function(password, game_id) {
        if (Passcodes.has(password)) {
            return false;
        }

        Passcodes.set(password, game_id);

        return true;
    },

    /*
     * Either returns a game object or undefined if the game does not exist
     */
    getRoom: function(room_id) {
        return Games.get(room_id);
    },

    getRoomByPassword: function(password) {
        if (!Passcodes.has(password)) {
            return undefined;
        }

        let game_id = Passcodes.get(password);
        return Games.get(game_id);
    },

    getRoomId: function(password) {
        if (!Passcodes.has(password)) {
            return undefined;
        }

        return Passcodes.get(password);
    },

    showGames: function() {
        console.log(Games);
    },
}

module.exports = GameManager;
