const GameStatus = require("../enums/gameStatus");
const PlayerStatus = require("../enums/playerStatus");

// A Game class that incorporates the usage of websockets
//
// Let's re-hash the code so that this is the primary controller of the application
class GameWS {
    /**
     * Represents a game
     * 
     * @constructor
     * @param {string} id - The id of the game 
     */
    constructor(id) {
        this.id = id;

        this.status = GameStatus.Pending;
        this.isOpen = false;
        this.hostSocket = undefined;
        this.players = [];
    }

    // Expects ws to be a new websocket
    setHost(ws) {
        this.hostSocket = ws;
    }

    addPlayer(player) {
        if (!(this.isOpen && this.status === GameStatus.Ready)) {
            return false;
        }

        this.players.push(player);

        // Notify the host that there was a player who joined
        let data = {
            method: "player-join",
            data: player,
        }
        this.hostSocket.send(JSON.stringify(data));
            
        return true;
    }

    addPlayerSocket(ws, player_id) {
        let player = this.players.find(p => {return p.id === player_id});
        
        if (player === undefined) {
            return false;
        }
        
        player.setWebsocket(ws);
        return true;
    }

    // This method can only be run PROVIDED that we have added our host connection
    // TODO: ensure that the host is active before running
    makeReady() {
        if (this.hostSocket !== undefined) {
            this.status = GameStatus.Ready;
            this.isOpen = true;
        }
    }

    // Updates the username for player with player_id. Returns a boolean indicating
    // whether or not this was successful
    setUsername(player_id, username) {
        let player = this.players.find(obj => {return obj.id === player_id});

        if (player === undefined) {
            return false;
        }

        // Ensures that users are unique :)
        if (this.players.find(obj => {return obj.username === username})) {
            return false;
        }

        // for (let p of this.players) {
        //     console.log(p.username);
        // }

        let success = player.setUsername(username);

        // for (let p of this.players) {
        //     console.log(p.username);
        // }
        
        if (success) {
            // Notify the host on the success
            let data = {
                method: "set-username",
                data: player.getData(),
            }
            this.hostSocket.send(JSON.stringify(data));
        }

        return success;
    }

    // NOTE: due to the guards on the game state, and the effects when we change the
    // state, these methods have no affect if the game is NOT ready
    closeRoom() {
        this.isOpen = false;
    }

    openRoom() {
        this.isOpen = true;
    }

    // Removes a player based on their player id. If the player with that id does not
    // exist, then this method does nothing
    removePlayer(player_id) {
        let player = this.players.find(obj => {return obj.id === player_id});

        // Return early as the player does not exist
        if (player === undefined) {
            return;
        }

        this.players = this.players.filter(player => player.id !== player_id);
        
        // Close the connection
        player.ws.close(3000);
    }

    // The game can only start provided there is at least one player and no
    // pending players
    // Returns: a boolean indicating whether or not this was successful
    startGame() {
        let pendingPlayers = this.players.filter(player => {
            PlayerStatus.isEqual(player.status, PlayerStatus.Pending);
        });

        // if (pendingPlayers.length > 0 || this.players.length < 1) {
        //     return false;
        // }

        this.status = GameStatus.Active;

        let data = {
            method: "start-game",
            data: {},
        }

        for (const player of this.players) {
            player.ws.send(JSON.stringify(data));
        }
        
        return true;
    }

    handleBuzz(user_id) {
        // We can only get a successful buzz when the game is active
        // and no one else has triggered a buzz successfully
        let success = GameStatus.isEqual(this.status, GameStatus.Active);
        if (success) {
            this.status = GameStatus.ActiveBuzz;
            
            let data = {
                method: "buzz",
                data: {
                    user_id: user_id,
                }
            }

            this.hostSocket.send(JSON.stringify(data));
        } 
        
        return success;
    }

    correctAnswer(user_id) {
        let data = {
            method: "correct-answer",
            data: {
                user_id: user_id,
            }
        }

        // Let everyone know who ISN'T the one who guessed know
        for (let p of this.players) {
            p.ws.send(JSON.stringify(data));
        }
    }

    incorrectAnswer(user_id) {
        let player = this.players.find(obj => {return obj.id === user_id});

        // Return early as the player does not exist
        if (player === undefined) {
            return;
        }

        let data = {
            method: "incorrect-answer",
            data: {
                user_id: user_id,
            }
        }

        player.ws.send(JSON.stringify(data));
    }
}

module.exports = GameWS;