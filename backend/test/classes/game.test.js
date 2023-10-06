const { v4: uuidv4 } = require('uuid');
const Player = require('../../src/classes/player');
const Game = require('../../src/classes/game');
const GameStatus = require('../../src/enums/gameStatus');
const PlayerStatus = require('../../src/enums/playerStatus');

// Mock the v4 value to always return a constant value
const UUID = "UUID";
const N_PLAYERS = 5;

function getID(id) {
    return `${UUID} - ${id}`
}

jest.mock('uuid', () => {
    const originalModule = jest.requireActual('uuid');
    let counter = 0;

    function getUUID() {
        let output = `${UUID} - ${counter % N_PLAYERS}`;
        ++counter;
        return output;
    }

    return {
        __esModule: true,
        ...originalModule,
        v4: jest.fn(getUUID),
    }
})

describe("Game Module Tests", () => {
    let players = [];

    beforeEach(() => {
        players = [];

        for (let i = 0; i < N_PLAYERS; ++i) {
            const player = new Player();
            players.push(player);
        }
    });

    describe("Initialization", () => {
        let newGame = new Game(UUID);

        it("Initializes with no players", () => {
            expect(newGame.players).toEqual([]);
        });

        it("Initializes as pending", () => {
            expect(newGame.status).toBe(GameStatus.Pending);
        });

        it("Initializes to open", () => {
            expect(newGame.isOpen).toBe(true);
        });
    });

    describe("Functionality", () => {
        let game;

        beforeEach(() => {
            game = new Game(UUID);
        });

        describe("joining a game", () => {
            it("can add new players", () => {
                for(const player of players) {
                    game.addPlayer(player);
                }
    
                expect(game.players).toEqual(players);
            });

            it("can be locked", () => {
                game.closeRoom();
    
                for(const player of players) {
                    game.addPlayer(player);
                }
    
                expect(game.players).toEqual([]);
            });

            it("can be unlocked", () => {
                game.closeRoom();
                game.openRoom();
    
                for(const player of players) {
                    game.addPlayer(player);
                }
    
                expect(game.players).toEqual(players);
            });

            it("can add players after its started", () => {
                game.startGame();

                for(const player of players) {
                    game.addPlayer(player);
                }
    
                expect(game.players).toEqual(players);
            })
        })

        describe("usernames", () => {
            beforeEach(() => {
                for (const player of players) {
                    game.addPlayer(player);
                }
            });

            it("can set usernames", () => {
                for (let i = 0; i < N_PLAYERS; ++i) {
                    let username = `username - ${i}`;
                    let id = getID(i);

                    game.setUsername(id, username);
                    expect(game.players[i].username).toBe(username);
                } 
            });

            it("prevents duplicate usernames", () => {
                let username = "username";
                let id_1 = getID(0);
                let id_2 = getID(1);

                game.setUsername(id_1, username);
                game.setUsername(id_2, username);

                expect(game.players[1].username).toBe(undefined);
            });
        });

        describe("game progression", () => {
            it("can start", () => {
                game.addPlayer(players[0]);
                game.addPlayer(players[1]);
    
                game.setUsername(getID(1), "username");
                game.startGame();
    
                expect(game.status).toBe(GameStatus.Active);
                expect(game.players[0].status).toBe(PlayerStatus.Pending);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
            });

            it("can go to the next question", () => {
                game.addPlayer(players[0]);
                game.addPlayer(players[1]);
                game.addPlayer(players[2]);

                game.setUsername(getID(0), "username - 0");
                game.setUsername(getID(1), "username - 1");

                game.startGame();

                game.nextQuestion();
                expect(game.players[0].status).toBe(PlayerStatus.Active);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
                expect(game.players[2].status).toBe(PlayerStatus.Pending);

                game.buzz(getID(0));
                game.nextQuestion();
                expect(game.players[0].status).toBe(PlayerStatus.Active);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
                expect(game.players[2].status).toBe(PlayerStatus.Pending);

                game.buzz(getID(1));
                game.correctAnswer();
                game.nextQuestion();
                expect(game.players[0].status).toBe(PlayerStatus.Active);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
                expect(game.players[2].status).toBe(PlayerStatus.Pending);

                game.buzz(getID(0));
                game.incorrectAnswer();
                game.nextQuestion();
                expect(game.players[0].status).toBe(PlayerStatus.Active);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
                expect(game.players[2].status).toBe(PlayerStatus.Pending);
            })
        });

        describe("buzzer functionality", () => {
            beforeEach(() => {
                for (let i = 0; i < N_PLAYERS; ++i) {
                    let username = `username - ${i}`;
                    let id = getID(i);

                    game.addPlayer(players[i]);

                    if (i < N_PLAYERS - 1) {
                        game.setUsername(id, username);
                    }
                    game.startGame();
                }
            });

            it("can handle buzzes", () => {
                let id = getID(0);
                game.buzz(id);

                expect(game.players[0].status).toBe(PlayerStatus.Buzz);
            });

            it("ensures only one user buzzes", () => {
                let id_1 = getID(0);
                let id_2 = getID(1);

                game.buzz(id_1);
                game.buzz(id_2);

                expect(game.players[0].status).toBe(PlayerStatus.Buzz);
                expect(game.players[1].status).toBe(PlayerStatus.Active);
            });

            it("ensures only joined players can buzz", () => {
                let id = getID(N_PLAYERS - 1);
                game.buzz(id);

                expect(game.players[N_PLAYERS - 1].status).toBe(PlayerStatus.Pending);
            })

            it("can have correct answers", () => {
                let id = getID(0);
                game.buzz(id);

                game.correctAnswer();

                expect(game.players[0].points).toBe(1);
                expect(game.players[0].status).toBe(PlayerStatus.Correct);
                expect(game.status).toBe(GameStatus.ActiveCorrect);
            });

            it("can have incorrect answers", () => {
                let id = getID(0);
                game.buzz(id);

                game.incorrectAnswer();

                expect(game.players[0].points).toBe(0);
                expect(game.players[0].status).toBe(PlayerStatus.Incorrect);
                expect(game.status).toBe(GameStatus.ActiveIncorrect);
            });

            it("allows buzzes after an incorrect answer", () => {
                let id = getID(0);
                game.buzz(id);

                game.incorrectAnswer();
                game.openBuzzer();

                id = getID(1);
                game.buzz(id);

                expect(game.players[1].status).toBe(PlayerStatus.Buzz);
            })

            it.todo("can handle latency");
        })
    });
})