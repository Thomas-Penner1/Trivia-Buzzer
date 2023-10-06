// A mock websocket, so that we are able to test various
// results of the functions
class MockWebSocket {
    constructor() {
        this.messages = [];
    }

    /**
     * 
     * @param {string} message 
     */
    send(message) {
        this.messages.push(message);
    }
}

module.exports = MockWebSocket;