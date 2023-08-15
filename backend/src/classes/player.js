const { v4: uuidv4 } = require('uuid');

const PlayerStatus = require('../enums/playerStatus');

// A class to describe a player object in javascript
class Player {
    constructor() {
        this.id = uuidv4();
        this.status = PlayerStatus.Pending;
        this.username = undefined;
        this.ws = undefined;
        this.points = 0;
    }

    setUsername(name) {
        // Currently, only check is that the name is at least 1 long
        if (name.length < 1) {
            return false;
        }
        
        this.username = name;
        this.status = PlayerStatus.Ready;

        return true;
    }

    addPoints(points) {
        this.points += points;
    }

    setWebsocket(ws) {
        this.ws = ws;
    }

    getData() {
        return {
            id: this.id,
            status: this.status,
            username: this.username,
            points: this.points,
        }
    }
}

module.exports = Player