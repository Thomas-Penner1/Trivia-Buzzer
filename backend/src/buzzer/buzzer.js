const { v4: uuidv4 } = require('uuid');

const Player = require('../classes/player');

const GameManager = require('../util/gameManager');
const MessageMethod = require('../enums/messageMethod');
const ConnectionManager = require('../util/connectionManager');

/*
 * Creates and stores a new uuid for usage in the values. This sends the
 * UUID and a passcode to the front end, allowing them to connect with
 * the user
 */
function createGame(req, res) {
    let room_id = uuidv4();
    let user_id = uuidv4();

    GameManager.createGame(room_id, user_id);

    let data = {
        'room_id': room_id,
        'user_id': user_id,
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

    // The game does not exist
    if (game === undefined) {
        let data = {
            'success': false,
            'reason': 0
        }
        res.json(data);
        return;
    }

    // On successful requests, we also attach a player object to the value
    let newPlayer = new Player();
    let game_id = GameManager.getRoomId(room_code);
    let success = game.addPlayer( newPlayer );

    // We also need to let everyone know that a new player has joined the game
    ConnectionManager.SendHost(newPlayer.id, MessageMethod.JoinGame, game);
    
    let data = {};

    if (success) {
        data = {
            'success': true,
            'player': newPlayer,
            'room_code': game_id,
        }
    } else {
        data = {
            'success': false,
            'reason': 1,
        }
    }

    res.json(data);
}

module.exports = {
    createGame,
    joinRoom,
}