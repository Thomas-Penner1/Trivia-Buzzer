const { v4: uuidv4 } = require('uuid');

const MessageMethod = require('../enums/messageMethod');
const { generateRoomPassword } = require('../util/buzzerUtil');
const GameManager = require('../util/gameManager');
const Player = require('../classes/player');
const { WebSocket } = require('ws');
const Game = require('../classes/game');
const ConnectionManager = require('../util/connectionManager');
const CloseMethod = require('../enums/closeMethod');

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


/**
 * Sends a message to the host with a constant format so that we can ensure
 * predictable formats on the front-end
 * 
 * @param {WebSocket} ws 
 * @param {MessageMethod} method 
 * @param {Game} game 
 */
function sendMessage(ws, method, game) {
    console.warn("Deprecated function. Please use ConnectionManager to send message")
    let data = {
        method: method.name,
        timestamp: Date.now(),
        game: game,
    }

    ws.send(JSON.stringify(data));
}

/**
 * 
 * @param {WebSocket} ws 
 * @param {*} request
 */
function handleConnection(ws, request) {
    let url = new URL(request.url, `ws://${request.headers.host}`);

    let user_id = url.searchParams.get('user_id');
    let game_id = url.searchParams.get('game_id');

    // console.log("ids:", user_id, game_id);
    
    let Game = GameManager.getRoom(game_id);

    const isHost = (user_id === Game.host_id);

    ConnectionManager.AddSocket(user_id, ws);

    function GetState() {
        sendMessage(ws, MessageMethod.GetState, Game);
    }

    function SetUsername(data) {
        Game.setUsername(user_id, data.username);

        ConnectionManager.SendHost(user_id, MessageMethod.SetUsername, Game, data);
    }

    function Buzz() {

    }

    function OpenRoom() {
        if (user_id !== Game.host_id) {
            return;
        }

        Game.openRoom();
        sendMessage(ws, MessageMethod.OpenRoom, Game);
    }

    function CloseRoom() {
        if (user_id !== Game.host_id) {
            return;
        }

        Game.closeRoom();
        sendMessage(ws, MessageMethod.CloseRoom, Game);
    }

    function RemovePlayer(data) {
        Game.removePlayer(data.user_id);

        ConnectionManager.RemoveSocket(data.user_id, CloseMethod.RemovePlayer);
        ConnectionManager.SendHost(user_id, MessageMethod.RemovePlayer, Game, data);
    }

    function StartGame() {
        Game.startGame();

        ConnectionManager.SendBroadcast(user_id, MessageMethod.StartGame, Game);
    }

    function NextQuestion() {

    }

    function CorrectAnswer() {

    }

    function IncorrectAnswer() {

    }

    function Invalid() {

    }

    function HandleCloseHost() {
        Game.endGame();

        for (const player of Game.players) {
            ConnectionManager.RemoveSocket(player.id, CloseMethod.HostClosed);
        }
    }

    function HandleCloseClient() {
        Game.removePlayer(user_id);
        ConnectionManager.RemoveSocket(user_id);
        ConnectionManager.SendHost(user_id, MessageMethod.PlayerClose, Game);
    }

    let id = uuidv4();

    Connections.set(id, ws);

    // Handle the incoming information
    ws.on('message', function(message) {
        const str = message.toString();
        const obj = JSON.parse(str);

        console.log(obj);
        
        // let user_id = obj.user_id;
        // let game_id = obj.game_id;
        let method = MessageMethod.convertString(obj.method);
        let data = obj.data;

        switch (method) {
            case MessageMethod.GetState:
                GetState();
                break;

            case MessageMethod.SetUsername:
                SetUsername(data);
                break;

            case MessageMethod.Buzz:
                break;

            case MessageMethod.OpenRoom:
                OpenRoom();
                break;

            case MessageMethod.CloseRoom:
                CloseRoom();
                break;

            case MessageMethod.RemovePlayer:
                RemovePlayer(data);
                break;
            
            case MessageMethod.StartGame:
                StartGame();
                break;

            case MessageMethod.NextQuestion:
                break;

            case MessageMethod.CorrectAnswer:
                break;

            case MessageMethod.IncorrectAnswer:
                break;

            default:
                return MessageMethod.INVALID;
        }
    });

    // Handling the close event - note: this will work for detecting when the user
    // intentionally leaves the game, but is not able to be used to detect when
    // a user is disconnected
    ws.on('close', (eventCode, reason) => {
        // Right now, we want to handle ALL closes the same way - we will refine
        // this later
        if (isHost) {
            HandleCloseHost();
        } else {
            HandleCloseClient();
        }

        Connections.clear(id);

        console.log(eventCode);
        console.log(reason);
    });


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
                method: MessageMethod.SetUsername.name,
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
            method: "success",
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

function CorrectAnswer(ws, game_id, user_id) {
    let game = GameManager.getRoom(game_id);
    game.correctAnswer(user_id);
}

function IncorrectAnswer(ws, game_id, user_id) {
    let game = GameManager.getRoom(game_id);
    game.incorrectAnswer(user_id);
}

module.exports = {
    handleConnection,
}