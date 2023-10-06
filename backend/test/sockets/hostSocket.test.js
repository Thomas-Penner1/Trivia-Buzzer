const ws = require('ws');
const HostSocket = require('../../src/sockets/hostSocket');

describe("Host Socket: Set Up", () => {
    it("constructor", () => {
        let socket = new ws.WebSocket();
        let hostSocket = new HostSocket(socket);

        hostSocket.socket.send("Message 1");
        hostSocket.socket.send("Message 2");

        expect(hostSocket.socket.messages).toEqual(["Message 1", "Message 2"]);
    });
});


describe("Host Socket: Send Messages", () => {
    let hostSocket;
    let expectedMessage;

    beforeEach(() => {
        let socket = new ws.WebSocket();
        hostSocket = new HostSocket(socket);
        expectedMessage = {};
    });

    it("Start Game", () => {
        expect(hostSocket.socket.messages).toEqual([JSON.stringify(expectedMessage)]);
    });

    it ("Next Question", () => {
        expect(hostSocket.socket.messages).toEqual([JSON.stringify(expectedMessage)]);
    });
});


describe("Host Socket: Receive Messages", () => {
})