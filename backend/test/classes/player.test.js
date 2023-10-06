const { v4: uuidv4 } = require('uuid');

const Player = require('../../src/classes/player');
const PlayerStatus = require('../../src/enums/playerStatus');
// const MockWebSocket = require('../mocks/mockWebsocket');

// Mock the v4 value to always return a constant value
const UUID = "UUID";

jest.mock('uuid', () => {
    const originalModule = jest.requireActual('uuid');

    return {
        __esModule: true,
        ...originalModule,
        v4: jest.fn(() => UUID),
    }
})

// Basic tests to ensure that the initialization, set methods, and get methods
// Ensures that these methods do not alter any un-expected underlying values
describe("Player Module Tests", () => {
    // const id = uuidv4();
    let player;

    const allStatus = [
        PlayerStatus.Pending,
        PlayerStatus.Ready,
        PlayerStatus.Active,
        PlayerStatus.Buzz,
        PlayerStatus.Incorrect,
        PlayerStatus.Correct,
    ]

    const negativeBuzz = [
        PlayerStatus.Pending,
        PlayerStatus.Ready,
        PlayerStatus.Buzz,
        PlayerStatus.Incorrect,
        PlayerStatus.Correct,
    ];

    const positiveBuzz = PlayerStatus.Active;

    beforeEach(() => {
        player = new Player();
    });

    it("Create Player", () => {
        expect(player.id).toBe(UUID);
        expect(player.status).toBe(PlayerStatus.Pending)
        expect(player.username).toBe(undefined);
        expect(player.points).toBe(0);
    });

    it("Set Username", () => {
        const username = "username";
        player.setUsername(username);

        expect(player.username).toBe(username);
        expect(player.status).toBe(PlayerStatus.Ready);
        expect(player.points).toBe(0);
    });

    it("Set Username Empty", () => {
        const username = "";
        player.setUsername(username);

        expect(player.username).toBe(undefined);
        expect(player.status).toBe(PlayerStatus.Pending);
        expect(player.points).toBe(0);
    });

    it("Set Username Whitespace", () => {
        const username = "  hello\t\n  ";
        const target = "hello";
        player.setUsername(username);

        expect(player.username).toBe(target);
        expect(player.status).toBe(PlayerStatus.Ready);
        expect(player.points).toBe(0);
    });

    it("Add Points Positive", () => {
        player.addPoints(1);
        expect(player.points).toBe(1);

        player.addPoints(2);
        expect(player.points).toBe(3);

        player.addPoints(3);
        expect(player.points).toBe(6);

        player.addPoints(4);
        expect(player.points).toBe(10);
    });

    it("Add Points Negative", () => {
        const points = -1;
        player.addPoints(points);

        expect(player.points).toBe(0);
    });

    it("Set Status", () => {
        for (const val of allStatus) {
            player.setStatus(val);
            expect(player.status).toBe(val);
        }
    })

    it("Continue Game", () => {
        const username = "hello";

        // Test pending
        player.continueGame();

        expect(player.status).toBe(PlayerStatus.Pending);

        // Test ready
        player.setUsername(username);
        player.continueGame();

        expect(player.status).toBe(PlayerStatus.Active);

        // Test active
        player.setStatus(PlayerStatus.Active);
        player.continueGame();
        expect(player.status).toBe(PlayerStatus.Active);

        // Test Buzz
        player.setStatus(PlayerStatus.Buzz);
        player.continueGame();
        expect(player.status).toBe(PlayerStatus.Active);

        // Test Incorrect
        player.setStatus(PlayerStatus.Incorrect);
        player.continueGame();
        expect(player.status).toBe(PlayerStatus.Active);

        // Test Correct
        player.setStatus(PlayerStatus.Correct);
        player.continueGame();
        expect(player.status).toBe(PlayerStatus.Active);
    })

    it("Can Buzz", () => {
        let result;

        for (const val of negativeBuzz) {
            player.setStatus(val);
            result = player.canBuzz();
            expect(result).toBe(false);
        }

        player.setStatus(positiveBuzz);
        result = player.canBuzz();
        expect(result).toBe(true);
    });

    it("Buzz", () => {
        let result;

        for (const val of negativeBuzz) {
            player.setStatus(val);
            player.buzz();
            expect(player.status).toBe(val);
        }

        player.setStatus(positiveBuzz);
        player.buzz();
        expect(player.status).toBe(PlayerStatus.Buzz);
    });
})
