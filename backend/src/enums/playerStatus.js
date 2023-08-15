class PlayerStatus {
    static isEqual(val1, val2) {
        return val1.name === val2.name;
    }

    static Pending = new PlayerStatus("Pending");
    static Ready = new PlayerStatus("Ready");

    constructor(name) {
        this.name = name;
    }
}

module.exports = PlayerStatus;