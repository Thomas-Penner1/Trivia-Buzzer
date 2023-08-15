// Pending: Game has been created
// Ready:   Game is able to accept users
// Active:  Game has started
class GameStatus {
    static Pending = new GameStatus("Pending");
    static Ready = new GameStatus("Ready");
    static Active = new GameStatus("Active");
    static ActiveBuzz = new GameStatus("ActiveBuzz");

    constructor(name) {
        this.name = name;
    }

    static isEqual(val1, val2) {
        return val1.name === val2.name;
    }
};

module.exports = GameStatus;