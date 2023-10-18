const { WebSocket } = require("ws");
const MessageMethod = require("../enums/messageMethod");
const Game = require("../classes/game");
const CloseMethod = require("../enums/closeMethod");
const { v4: uuidv4 } = require('uuid');

var ConnectionManager = {
    Connections: new Map(),


    /**
     * Creates a record of the websocket for the given id
     * Note that this fails when we the id already exists in the
     * connections
     * 
     * @param {string} id 
     * @param {WebSocket} ws
     * @param {boolean} is_host
     */
    AddSocket: function(id, ws, is_host) {
        this.Connections.set(id, 
            {
                socket: ws,
                is_host: is_host,
            }
        );
    },


    /**
     * Removes a websocket by id from the collection
     * @param {string} id 
     * @param {(CloseMethod|undefined)} reason
     */
    RemoveSocket: function(id, reason) {
        let entry = this.Connections.get(id);

        if (entry !== undefined) {
            let ws = entry.socket;

            if (reason !== undefined) {
                ws.close(reason.code);
            } else {
                ws.close();
            }
        }

        this.Connections.delete(id);
    },


    /**
     * 
     * @param {string} sender_id 
     * @param {MessageMethod} method 
     * @param {Game} game 
     * @param {*} data 
     */
    SendSender: function(sender_id, method, game, response_id, data) {
        this._SendMessage(sender_id, sender_id, method, game, response_id, data);
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
    SendHost: function(sender_id, method, game, response_id, data) {
        this._SendMessage(sender_id, game.host_id, method, game, response_id, data);

        if (sender_id !== game.host_id) {
            this._SendMessage(sender_id, sender_id, method, game, response_id, data);
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
    SendBroadcast: function(sender_id, method, game, response_id, data) {
        this.SendHost(sender_id, method, game, response_id, data);

        for (const player of game.players) {
            this._SendMessage(sender_id, player.id, method, game, response_id, data);
        }
    },

    /**
     * 
     * @param {string} sender_id 
     * @param {string} receiver_id 
     * @param {MessageMethod} method
     * @param {Game} game
     * @param {string} response_id
     * @param {any} data
     * @returns 
     */
    _SendMessage: function(sender_id, receiver_id, method, game, response_id, data) {
        let entry = this.Connections.get(receiver_id);

        if (entry === undefined) {
            return;
        }

        let out_data = {
            id: uuidv4(),
            response_id: response_id,
            method: method.name,
            timestamp: Date.now(),
            sender: sender_id,
            data: data,
        };

        if (entry.is_host) {
            out_data.game = game;

            out_data.message_type = "HOST";

        } else {
            let player = game.players.find((p) => p.id === receiver_id);

            console.log(player);

            out_data.player = player;
            out_data.active_player = game.activePlayer;

            out_data.message_type = "PLAYER";

            console.log(out_data);
        }

        // console.log(out_data);

        entry.socket.send(JSON.stringify(out_data));
    },
}

module.exports = ConnectionManager;