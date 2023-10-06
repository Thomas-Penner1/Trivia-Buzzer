const GameStatus = require("../enums/gameStatus");
const PlayerStatus = require("../enums/playerStatus");
const Player = require("./player");

class Game {
    /**
     * 
     * @param {string} id 
     * @param {string} host_id 
     * @param {string} passcode 
     */
    constructor(id, host_id, passcode) {
        this.id = id;
        this.host_id = host_id;
        this.passcode = passcode;

        // Essentially game statuses
        this.isOpen = true;
        this.status = GameStatus.Pending;

        // Player participants of the game
        this.players = [];
        this.activePlayer = undefined;
    }


    /**
     * Adds a new player to the game. Note that a new player may only be added
     * when the game is not in a locked state
     * @param {Player} player 
     * @returns boolean
     */
    addPlayer(player) {
        if (!this.isOpen) {
            return false;
        }

        this.players.push(player);
        return true;
    }

    
    /**
     * Remove a player from the game. If the player does not exist, then this
     * method return false
     * 
     * @param {string} playerId
     * @returns boolean
     */
    removePlayer(playerId) {
        let player = this.players.find(obj => {return obj.id === playerId});

        if (player === undefined) {
            return false;
        }

        this.players = this.players.filter(player => player.id != playerId);
        return true;
    }

    /**
     * Sets up the username 
     * @param {string} player_id 
     * @param {string} username
     */
    setUsername(player_id, username) {
        let player = this.players.find(obj => {
            return obj.id === player_id;
        });

        // Player with matching id does not exist
        if (player === undefined) {
            return;
        }

        // Player with username already exists
        if (this.players.find(obj => {return obj.username === username})) {
            return;
        }

        player.setUsername(username);
    }

    // NOTE: open and closing rooms only does something if the game is ready
    closeRoom() {
        this.isOpen = false;
    }

    openRoom() {
        this.isOpen = true;
    }

    // Starts the game from the game's perspective
    startGame() {
        this.status = GameStatus.Active;

        for (let player of this.players) {
            if (player.status === PlayerStatus.Ready) {
                player.setStatus(PlayerStatus.Active);
            }
        }
    }

    // Continues the game from the game's perpective
    nextQuestion() {
        this.status = GameStatus.Active;

        for (let player of this.players) {
            if (player.status !== PlayerStatus.Pending) {
                player.setStatus(PlayerStatus.Active);
            }
        }
    }

    /**
     * Registers the buzz as coming from the player with player_id
     * 
     * TODO: add latency support
     * 
     * @param {string} player_id 
     */
    buzz(player_id) {
        if (this.status !== GameStatus.Active) {
            return;
        }

        let player = this.players.find(obj => {return obj.id === player_id});

        if (player === undefined || !player.canBuzz()) {
            return false;
        }

        player.buzz();
        this.activePlayer = player;
        this.status = GameStatus.ActiveBuzz;
    }

    correctAnswer() {
        if (this.activePlayer === undefined) {
            return;
        }

        this.activePlayer.setStatus(PlayerStatus.Correct);
        this.activePlayer.addPoints(1);
        this.status = GameStatus.ActiveCorrect;
    }

    incorrectAnswer() {
        if (this.activePlayer === undefined) {
            return;
        }

        this.activePlayer.setStatus(PlayerStatus.Incorrect);
        this.status = GameStatus.ActiveIncorrect;
    }

    openBuzzer() {
        this.activePlayer = undefined;
        this.status = GameStatus.Active;
    }
}

module.exports = Game;