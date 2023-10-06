import { appConfig } from "@/app/config";
import EventEmitter from "events";
import { MessageMethod } from "./enums/MessageMethod";
import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";
import { GameState } from "./enums/GameState";

export enum PlayerJoinStatus {
    success = 0,
    already_initialized,
    room_does_not_exist,
    room_closed,
    unknown,
}

export enum PlayerEvent {
    update = "update",
}

class PlayerManager extends EventEmitter {
    private socket?: WebSocket;
    private game_id: string;
    private user_id: string;
    private is_initialized: boolean;

    // private usernames: string[];
    private gameState: GameState;
    private player: Player;
    private active_player?: Player;

    constructor() {
        super();

        this.game_id = "";
        this.user_id = "";
        this.is_initialized = false;

        this.gameState = GameState.Pending;
        // this.usernames = [];

        this.player = {
            id: "",
            points: 0,
            status: PlayerStatus.Pending,
        }
    }

    reset() {
        if (this.socket !== undefined) {
            this.socket.close(4000, "closed connection");
            this.socket = undefined;
        }

        this.game_id = "";
        this.user_id = "";
        this.is_initialized = false;

        this.player = {
            id: "", 
            points: 0,
            status: PlayerStatus.Pending,
        }
        this.active_player = undefined;
    }

    async initialize(room_code: string): Promise<PlayerJoinStatus> {
        if (this.is_initialized) {
            return PlayerJoinStatus.already_initialized;
        }

        let url = appConfig.serverBaseUrl + "/buzzer/join-room";
        const data = {
            roomCode: room_code,
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            this.game_id = result.room_code;
            this.user_id = result.player.id;
            this.is_initialized = true;

            this.player.id = this.user_id;

            this.connect();

            return PlayerJoinStatus.success;

        } else {
            if (result.reason === 0) {
                return PlayerJoinStatus.room_does_not_exist;
            } else if (result.reason === 1) {
                return PlayerJoinStatus.room_closed;
            }

            return PlayerJoinStatus.unknown;
        }
    }

    /**
     * 
     * @returns A copy of this player's object. This way, we can always get a
     * new reference for the webpages
     */
    getPlayer(): Player {
        return {...this.player} as Player;
    }

    getActivePlayer() {
        return undefined;
    }

    /**
     * 
     * @returns a copy of the usernames list
     */
    // getUsernames(): string[] {
    //     return [...this.usernames];
    // }

    sendBuzz() {

    }

    sendSetUsername(username: string): void {
        let data = {
            username: username,
        }

        this.send(MessageMethod.SetUsername, data);
    }

    // Private methods =======================================================
    private async connect(): Promise<void> {
        if (this.is_initialized !== true) {
            return;
        }

        this.socket = new WebSocket(`ws://localhost:3000/?user_id=${this.user_id}&game_id=${this.game_id}`);
        
        this.socket.onopen = () => {
            this.emit(PlayerEvent.update);
        }

        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            // console.log(this.user_id);
            console.log(JSON.parse(event.data));

            this.gameState = GameState[message.game.status.name as keyof typeof GameState];

            // this.usernames = [];
            // for (let player of message.game.players) {
            //     if (player.username) {
            //         this.usernames.push(player.username);
            //     }
            // }

            let p = message.game.players.find((element: any) => element.id === this.user_id);
            
            let username = p.username;
            let points = p.points;
            let playerStatus = PlayerStatus[p.status.name as keyof typeof PlayerStatus];

            this.player.username = username;
            this.player.points = points;
            this.player.status = playerStatus;

            this.emit(PlayerEvent.update);
        }

        this.socket.onclose = (event) => {
            let code = event.code;
            console.log(`code: ${code}`);
        }
    }

    private async send(method: MessageMethod, data?: any) {
        if (this.socket === undefined) {
            return;
        }

        let message = {
            method: method,
            timestamp: Date.now(),
            data: data,
        }

        this.socket.send(JSON.stringify(message));
    }
}

export default new PlayerManager();