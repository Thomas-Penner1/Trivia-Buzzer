const { WebSocket } = require("ws");
const MessageMethod = require("../enums/messageMethod");
const Game = require("../classes/game");
const CloseMethod = require("../enums/closeMethod");

var ConnectionManager = {
    Connections: new Map(),

    /**
     * Creates a record of the websocket for the given id
     * Note that this fails when we the id already exists in the
     * connections
     * 
     * @param {string} id 
     * @param {WebSocket} ws 
     */
    AddSocket: function(id, ws) {
        this.Connections.set(id, ws);
    },

    /**
     * Removes a websocket by id from the collection
     * @param {string} id 
     * @param {(CloseMethod|undefined)} reason
     */
    RemoveSocket: function(id, reason) {
        let socket = this.Connections.get(id);

        if (socket !== undefined && reason !== undefined) {
            socket.close(reason.code);
        }

        this.Connections.delete(id);
    },

    /**
     * Sends a message to the host, and to the person that initiated the
     * request. This method is called whenever an action results in the
     * user that send the action, and the host knowing the results
     * 
     * @param {string} sender_id 
     * @param {MessageMethod} method 
     * @param {Game} game 
     */
    SendHost: function(sender_id, method, game, data) {
        this._SendMessage(sender_id, game.host_id, method, game, data);

        if (sender_id !== game.host_id) {
            this._SendMessage(sender_id, sender_id, method, game, data);
        }
    },

    /**
     * Sends a message to everybody in the currently active game. This
     * method is called whenever an action results in everybody in the
     * lobby needing to know the result
     * 
     * @param {*} sender_id 
     * @param {*} method 
     * @param {*} game 
     */
    SendBroadcast: function(sender_id, method, game, data) {
        this.SendHost(sender_id, method, game, data);

        for (const player of game.players) {
            this._SendMessage(sender_id, player.id, method, game, data);
        }
    },

    /**
     * 
     * @param {string} sender_id 
     * @param {string} receiver_id 
     * @param {MessageMethod} method
     * @param {Game} game 
     * @returns 
     */
    _SendMessage: function(sender_id, receiver_id, method, game, data) {
        let socket = this.Connections.get(receiver_id);

        // if (sender_id !== receiver_id) {
        //     console.log(socket);
        // }

        if (socket === undefined) {
            return;
        }

        let out_data = {
            method: method.name,
            timestamp: Date.now(),
            sender: sender_id,
            game: game,
            data: data,
        };

        socket.send(JSON.stringify(out_data));
    },
}

module.exports = ConnectionManager;