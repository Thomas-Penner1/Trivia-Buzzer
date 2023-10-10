// Pending: Game has been created
// Ready:   Game is able to accept users
// Active:  Game has started
class GameStatus {
    static Pending         = new GameStatus("Pending");
    static Ready           = new GameStatus("Ready");
    static Active          = new GameStatus("Active");
    static ActiveBuzz      = new GameStatus("ActiveBuzz");
    static ActiveCorrect   = new GameStatus("ActiveCorrect");
    static ActiveIncorrect = new GameStatus("ActiveIncorrect");
    static Stopped          = new GameStatus("Stopped");

    constructor(name) {
        this.name = name;
    }
};

module.exports = GameStatus;