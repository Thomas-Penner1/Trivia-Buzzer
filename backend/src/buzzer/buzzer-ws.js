const { v4: uuidv4 } = require('uuid');

const MessageMethod = require('../enums/messageMethod');
const { generateRoomPassword } = require('../util/buzzerUtil');
const GameManager = require('../util/gameManager');
const Player = require('../classes/player');

/*
 * Expected message format:
 * {
 *      gameId: uuid,
 *      userId: uuid,
 *      method: string,
 *      data: {
 *          ...
 *      }     
 * }
 * 
 * gameId: which game is this message meant for
 * userId: which user is sending this request
 * method: which event are we triggering
 *      - 
 * data: the data to pass along to a method
 */

/*
 * Outgoing message format:
 * {
 *      method: string
 *      data: {
 *          ...
 *      }
 * }
 * 
 * Method - what the data represents
 * Data   - the data we are sending
 */

let Connections = new Map();

function handleConnection(ws) {
    let id = uuidv4();

    Connections.set(id, ws);

    // Handle the incoming information
    ws.on('message', function(message) {
        const str = message.toString();
        const obj = JSON.parse(str);

        console.log(obj);
        
        let user_id = obj.user_id;
        let game_id = obj.game_id;
        let method = new MessageMethod(obj.method);
        let data = obj.data;

        if (MessageMethod.isEqual(method, MessageMethod.JoinHost)) {
            JoinHost(ws, game_id);
        } else if (MessageMethod.isEqual(method, MessageMethod.JoinPlayer)) {
            JoinPlayer(ws, game_id, user_id)
        } else if (MessageMethod.isEqual(method, MessageMethod.SetUsername)) {
            SetUsername(ws, game_id, user_id, data.username);
        } else if (MessageMethod.isEqual(method, MessageMethod.OpenRoom)) {
            OpenRoom(ws, game_id);
        } else if (MessageMethod.isEqual(method, MessageMethod.CloseRoom)) {
            CloseRoom(ws, game_id);
        } else if (MessageMethod.isEqual(method, MessageMethod.RemovePlayer)) {
            RemovePlayer(ws, game_id, data.user_id);
        } else if (MessageMethod.isEqual(method, MessageMethod.StartGame)) {
            StartGame(ws, game_id);
        } else if (MessageMethod.isEqual(method, MessageMethod.Buzz)) {
            Buzz(ws, game_id, user_id);
        }
    });


    ws.on('close', () => Connections.clear(id));
    ws.emit('connection');
}

/*
 * Sets the host of a game, and notifies them of the passcode to join
 *      ws:      websocket of the host user
 *      game_id: id of the game to join
 */
function JoinHost(ws, game_id) {
    let game = GameManager.getRoom(game_id);
    game.setHost(ws);
    game.makeReady();

    let passcode;
    let success;

    // Ensures that the passcode gets set correctly. Note that this should not run
    // More that once as long as there are not too many passcodes in use
    do {
        passcode = generateRoomPassword();
        success = GameManager.addPassword(passcode, game_id);
    } while (!success);

    let data = {
        method: "passcode",
        data: {
            passcode: passcode,
        }
    }

    ws.send(JSON.stringify(data));
}

/*
 * Adds a player to a game, and notifies the host of this addition
 *      ws:      websocket of the player user
 *      game_id: id of the game we are joining
 */
function JoinPlayer(ws, game_id, user_id) {
    let game = GameManager.getRoom(game_id);
    let success = game.addPlayerSocket(ws, user_id);

    // If we were unable to have the player join the game, we are going to terminate
    // their connection
    if (!success) {
        ws.terminate();
    } else {
        let data = {
            method: "connect",
            data: {
            }
        }
        ws.send(JSON.stringify(data));
    }
}

/*
 * Sets a player's username
 */
function SetUsername(ws, game_id, user_id, username) {
    let game = GameManager.getRoom(game_id);
    let success = game.setUsername(user_id, username);

    let data;

    if (success) {
        data = {
            method: "success",
            data: {
                method: MessageMethod.SetUsername.name,
            }
        }

    } else {
        data = {
            method: "failure",
            data: {
                success: MessageMethod.SetUsername.name,
            }
        }
    }

    ws.send(JSON.stringify(data));
}

/*
 * Ensures that a given game is closed
 */
function CloseRoom(ws, game_id) {
    let game = GameManager.getRoom(game_id);
    game.closeRoom();
}

/*
 * Ensures that a given game is open
 */
function OpenRoom(ws, game_id) {
    let game = GameManager.getRoom(game_id);
    game.openRoom();
}

/*
 * Removes the player with player_id from teh game
 */
function RemovePlayer(ws, game_id, player_id) {
    let game = GameManager.getRoom(game_id);
    game.removePlayer(player_id);
}

/*
 * Starts a game, and notifies all players of the starting
 */
function StartGame(ws, game_id) {
    let game = GameManager.getRoom(game_id);
    let success = game.startGame();

    let data;

    if (success) {
        data = {
            method: "success",
            data: {
                method: "start-game",
            }
        }

    } else {
        data = {
            method: "failure",
            data: {
                method: "start-game",
            }
        }
    }

    ws.send(JSON.stringify(data));
}

/*
 * Handles a user buzzing in
 */
function Buzz(ws, game_id, user_id) {
    let game = GameManager.getRoom(game_id);
    let success = game.handleBuzz(user_id);

    let data;

    if (success) {
        data = {
            method: "succes",
            data: {
                method: "buzz",
            }
        }
    } else {
        data = {
            method: "failure",
            data: {
                method: "buzz",
            }
        }
    }

    ws.send(JSON.stringify(data));
}

module.exports = {
    handleConnection,
}