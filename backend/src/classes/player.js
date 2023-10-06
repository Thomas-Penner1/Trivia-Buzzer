const { v4: uuidv4 } = require('uuid');

const PlayerStatus = require('../enums/playerStatus');

class Player {
    constructor() {
        this.id = uuidv4();
        this.status = PlayerStatus.Pending;
        this.username = undefined;
        this.points = 0;
    }

    /**
     * Sets the username of the player. Expects the username to be at least
     * one character long
     * 
     * Does not check username uniqueness
     * 
     * @param {string} name 
     */
    setUsername(name) {
        let username = name.trim();

        if (username.length < 1) {
            return;
        }

        this.username = username;
        this.status   = PlayerStatus.Ready;
    }

    /**
     * Add a given number of points to a player's score. Does nothing if the points
     * are non-positive
     * 
     * @param {points} points - the number of points to be added to the player,
     *      expects it to be non-negative
     */
    addPoints(points) {
        if (points < 0) {
            return;
        }

        this.points += points;
    }

    /**
     * Moves the players state according to some business logic. Essentially allows
     * the given user to answer the next question as needed
     * 
     * @returns a boolean indicating whether or not the user successfully changed
     * state
     */
    continueGame() {
        if (this.status === PlayerStatus.Pending) {
            return;
        }

        this.status = PlayerStatus.Active;
    }

    /**
     * Simulates the event that this player was the one to buzz in. Note that we
     * can only buzz in under the following assumptions:
     *   - user is in the ACTIVE state
     */
    buzz() {
        if (!this.canBuzz()) {
            return;
        }

        this.status = PlayerStatus.Buzz;
    }

    /**
     * @returns {boolean} a boolean indicating whether or not this user is able to 
     * buzz in.
     */
    canBuzz() {
        return this.status === PlayerStatus.Active;
    }

    /**
     * Changes the status of the player. This will be useful, as it'll allow the
     * game object to controll the player's statuses
     * 
     * @param {PlayerStatus} status_name
     */
    setStatus(status_name) {
        this.status = status_name;
    }
}

module.exports = Player