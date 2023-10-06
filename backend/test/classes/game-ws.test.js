const { v4: uuidv4 } = require('uuid');

const GameWS = require("../../src/classes/game-ws");
// const MockWebSocket = require('../mocks/mockWebsocket');

// Functionality that does not really require much effort
describe("Game WS: Basic Functionality", () => {
    const id = uuidv4();
    let game;

    beforeEach(() => {
        game = new GameWS(id);
    });

    it("Create Initial State", () => {
        expect(game.id).toBe(id);
        expect(game.isOpen).toBe(false);
        expect(game.hostSocket).toBe(undefined);
        expect(game.players).toEqual([]);
    });

    it("Set Host", () => {
        const ws = new MockWebSocket();
        const m = "message";

        game.setHost(ws);
        game.hostSocket.send(m);

        expect(game.hostSocket).toEqual({"messages": [m]});
    });

    it("Open Room", () => {
        game.isOpen = false;
        game.openRoom();
        expect(game.isOpen).toBe(true);

    });

    if("Close Room", () => {
        game.isOpen = true;
        game.closeRoom();
        expect(game.isOpen).toBe(false);
    });
});


describe("Game WS: Add Players", () => {
    const id = uuidv4();
    let game;
    let hostSocket;

    beforeEach(() => {
        game = new GameWS(id);
        hostSocket = new MockWebSocket();
    });

    // Values for the players -------------------
    it("add player");
    it("add many players");
    it("add duplicate player");
    it("add player invalid");
});


describe("Game WS: Set Username", () => {

})