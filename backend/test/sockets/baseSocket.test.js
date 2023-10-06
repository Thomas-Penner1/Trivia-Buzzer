const ws = require('ws');
const Game = require('../../src/classes/game');
const BaseWebSocket = require('../../src/sockets/baseSocket');

const UUID = "UUID";

describe("Base Web Socket", () => {
    it("can send game states", () => {
        let game = new Game(UUID);
        let target = JSON.stringify(game);

        let socket = new ws.WebSocket();
        let baseSocket = new BaseWebSocket(socket);
        baseSocket.sendGameState(game);

        expect(baseSocket.ws.messages).toEqual([target]);
    })
})