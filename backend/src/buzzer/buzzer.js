const { v4: uuidv4 } = require('uuid');

const Game = require('../classes/game');
const Player = require('../classes/player');

const GameManager = require('../util/gameManager');

let Games = new Map();
let RoomCodes = new Map();

/*
 * Creates and stores a new uuid for usage in the values. This sends the
 * UUID and a passcode to the front end, allowing them to connect with
 * the user
 */
function createGame(req, res) {
    let room_id = uuidv4();
    let user_id = uuidv4();

    GameManager.createGame(room_id);

    let data = {
        'room_id': room_id,
        'user_id': user_id,
    }

    res.json(data);
}


/*
 * Generate a new passcode for a room, and formats it as a string
 * to pass to the front end
 * 
 * TODO: allow this method to have access to all currently active
 * passcodes, and prevent creating a new one. This shouldn't be an
 * issue with the current format
 */
function generateRoomPassword() {
    // NOTE: this may be etter to move to a spec file
    const N_DIGITS = 8;
    const MAX = 10 ** N_DIGITS;

    let value = Math.floor(Math.random() * MAX);

    let str_value = value.toString();

    // Ensure that all passwords are the same length in the event
    // that we have one that is too short
    if (str_value.length < N_DIGITS) {
        str_value = "0".repeat(N_DIGITS - str_value.length) + str_value;
    }

    return str_value;
}


/*
 * Creates a new room code for the room we are accessing.
 */
function generateRoomCode(req, res) {
    let room_id = req.params.roomCode;

    let passcode = generateRoomPassword();

    RoomCodes.set(passcode, room_id);
    
    let game = Games.get(room_id);
    game.makeReady();

    let data = {
        'room_code': passcode,
    }

    res.json(data);
}

/*
 * Allows a user to join a room. The user needs to provide the room code, and
 * we will then provide the actual game code to the user
 */
function joinRoom(req, res) {
    let room_code = req.body.roomCode;
    let game = GameManager.getRoomByPassword(room_code);

    if (game === undefined) {
        let data = {
            'success': false
        }
        res.json(data);
        return;
    }

    // On successful requests, we also attach a player object to the value
    let newPlayer = new Player();
    let game_id = GameManager.getRoomId(room_code);
    let success = game.addPlayer( newPlayer );
    
    let data = {};

    if (success) {
        // TODO: notify the front-end (moderator) that a new player has joined
        data = {
            'success': true,
            'player': newPlayer,
            'room_code': game_id,
        }
    } else {
        data = {
            'success': false,
        }
    }

    res.json(data);
}

/*
 * Allows a user to set their username. Note that we need to be able to find the
 * user for this to be able to work
 *
 * NOTE: relies on the logic that the user does NOT already exist, and that the user
 * is in the game that we think that they are
 */
function setUsername(req, res) {
    let game_id = req.params.roomCode;
    let player_id = req.params.playerId;
    let username = req.body.username;

    let game = Games.get(game_id);
    let sucess = game.setUsername(player_id, username);

    let data = {
        'success': sucess,
    };

    res.json(data);
}

/*
 * Closes a room, so that new members are unable to join
 * If the room is already closed, this does nothing
 */
function closeRoom(req, res) {
    let game_id = req.params.roomCode;

    // TODO: add error handling for when this doesn't exist
    let game = Games.get(game_id);

    game.closeRoom();
    res.sendStatus(200);
}

/*
 * Opens a room, so that new members are able to join
 * If the room is already open, this does nothing
 */
function openRoom(req, res) {
    let game_id = req.params.roomCode;
    let game = Games.get(game_id);

    game.openRoom();
    res.sendStatus(200);
}

/*
 * Starts the game. Takes a game that is in the "not started" state, and ensures that
 * we are able to get the game in the "started" state
 */
function startGame(req, res) {
    let game_id = req.params.roomCode;
    let game = Games.get(game_id);

    game.startGame();
    res.sendStatus(200);
}

/*
 * Removes a player from a given game
 */
function removePlayer(req, res) {
    let game_id = req.params.roomCode;
    let player_id = req.body.playerId;

    let game = Games.get(game_id);

    game.removePlayer(player_id);

    res.sendStatus(200);
}

/*
 * This method is called after a user has buzzed in. It determines whether or not
 * their answer was correct. In the event of a correct answer, we also increment
 * the response by a number of points
 */
function questionResult() {
    let game_id = req.params.roomCode;
    let player_id = req.params.playerId;

    res.sendStatus(200);
}

module.exports = {
    createGame,
    generateRoomCode,
    joinRoom,
    setUsername,
    closeRoom,
    openRoom,
    startGame,
    removePlayer,
    questionResult,
}