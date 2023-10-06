class PlayerStatus {
    static isEqual(val1, val2) {
        return val1.name === val2.name;
    }

    static Pending   = new PlayerStatus("Pending");
    static Ready     = new PlayerStatus("Ready");
    static Active    = new PlayerStatus("Active");
    static Buzz      = new PlayerStatus("Buzz");
    static Incorrect = new PlayerStatus("Incorrect");
    static Correct   = new PlayerStatus("Correct");

    constructor(name) {
        this.name = name;
    }
}

module.exports = PlayerStatus;