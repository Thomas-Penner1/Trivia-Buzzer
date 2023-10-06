class HostSocket {
    /**
     * 
     * @param {WebSocket} ws 
     */
    constructor(ws) {
        this.socket = ws;
    }

    // Send methods for the socket ===========================================
    sendStartGame() {
    }

    sendNextQuestion() {
        
    }

    /**
     * Base way for sending data
     * @param {*} method the method we are using
     * @param {*} data the data to be sent
     */
    _send(method, data) {
        let message = {
            method: method,
            data: data,
        }

        this.socket.send(JSON.stringify(message));
    }
};

module.exports = HostSocket;