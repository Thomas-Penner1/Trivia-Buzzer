const ws = require('ws');
const PlayerSocket = require('../../src/sockets/playerSocket');

describe("Player Socket: Set Up", () => {
    it("constructor", () => {
        let socket = new ws.WebSocket();
        let playerSocket = new PlayerSocket(socket);

        playerSocket.socket.send("Message 1");
        playerSocket.socket.send("Message 2");

        expect(playerSocket.socket.messages).toEqual(["Message 1", "Message 2"]);
    })
});

describe("Player Socket: Send Messages", () => {

});

describe("Player Socket: Receive Messages", () => {

});