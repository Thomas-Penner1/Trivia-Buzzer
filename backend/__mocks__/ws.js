const ws = jest.createMockFromModule('ws');

// Note that for our testing purposes, we don't really need the ability
// to do this as granularly as ws does it
class WebSocket {
    constructor() {
        this.messages = [];
    }

    send(message) {
        this.messages.push(message);
    }

    onmessage(fn) {

    }

    _triggerMessage(message) {
        
    }
}

ws.WebSocket = WebSocket;

module.exports = ws;