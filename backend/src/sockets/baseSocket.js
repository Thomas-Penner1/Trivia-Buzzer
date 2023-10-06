const EventEmitter = require('events');

const Game = require("../classes/game");

class BaseWebSocket extends EventEmitter {
    constructor(ws) {
        super();
        
        this.ws = ws;

        this.ws.onmessage((message) => {
            const str = message.toString();
            const obj = JSON.parse(str);

            let user_id = obj.user_id;
            let method = IncomingMessageMethod.convertString(obj.method);
            let data = obj.data;

            this.emit(method.toString(), user_id, data);
        })
    }

    /**
     * Sends a complete game state to a given socket
     * @param {Game} game 
     */
    sendGameState(game) {
        this.ws.send(JSON.stringify(game));
    }
}

module.exports = BaseWebSocket;