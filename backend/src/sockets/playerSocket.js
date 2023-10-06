import { EventEmitter } from 'node:events';

const IncomingMessageMethod = require("../enums/incomingMessageMethod");
const OutgoingMessageMethod = require("../enums/outgoingMessageMethod");

class PlayerSocket extends EventEmitter {
    /**
     * 
     * @param {WebSocket} ws 
     */
    constructor(ws) {
        super();

        this.socket = ws;
        this.user_id = "";
        this.game_id = "";

        this.socket.onmessage((message) => {
            const str = message.toString();
            const obj = JSON.parse(str);

            let user_id = obj.user_id;
            let method = IncomingMessageMethod.convertString(obj.method);
            let data = obj.data;

            this.emit(method.toString(), user_id, data);
        });
    }

    // Send methods for the socket ===========================================
    sendConnection() {
        this._send(OutgoingMessageMethod.Connection);
    }

    /**
     * 
     * @param {IncomingMessageMethod} method 
     */
    sendSuccess(method) {
        let data = {
            method: method.toString(),
        }

        this._send(OutgoingMessageMethod.Success, data);
    }

    /**
     * 
     * @param {IncomingMessageMethod} method 
     */
    sendFailure(method) {
        let data = {
            method: method.toString(),
        }

        this._send(OutgoingMessageMethod.Failure, data);
    }

    sendStartGame() {
        this._send(OutgoingMessageMethod.StartGame);
    }

    sendNextQuestion() {
        this._send(OutgoingMessageMethod.NextQuestion);
    }

    /**
     * A helper function to send outgoing messages, ensuring that each message
     * has the same format
     * 
     * @param {OutgoingMessageMethod} method 
     * @param {*} data 
     */
    _send(method, data) {
        let message = {
            method: method.toString(),
            data: data,
        }

        this.socket.send(JSON.stringify(message));
    }
}

module.exports = PlayerSocket;