class CloseMethod {
    // Server reserved values: 4000 - 4099 ===================================
    // Host closed connection: 4100 - 4199 ===================================
    static RemovePlayer = new CloseMethod(4100);
    static HostClosed   = new CloseMethod(4101);
    static HostEndedGame = new CloseMethod(4102);
    
    // User closed connection: 4200 - 4299 ===================================
    constructor(code) {
        this.code = code;
    }
}

module.exports = CloseMethod;