import { appConfig } from "@/app/config";
import { Game_ } from "@/data-structures/game";
import EventEmitter from "events";
import { MessageMethod } from "./enums/MessageMethod";
import { GameState } from "./enums/GameState";
import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";

export enum GameManagerEvents {
    update = "update",
}

class GameManager extends EventEmitter {
    private socket?: WebSocket;
    private game_id: string;
    private user_id: string;
    private game: Game_;
    private is_initialized: boolean;

    constructor() {
        super();

        this.game_id = "";
        this.user_id = "";
        this.is_initialized = false;
        this.game = new Game_();
    }

    clear() {
        this.game_id = "";
        this.user_id = "";

        if (this.socket !== undefined) {
            this.socket.close();
            this.socket = undefined;
        }

        this.is_initialized = false;
    }

    async initialize() {
        if (this.is_initialized) {
            return;
        }

        let url = appConfig.serverBaseUrl + "/buzzer/create-game";
        const response = await fetch(url, {
            method: "POST",
        });

        if (response.status != 200) {
            // TODO: Emit an event !
            // This will let the webpage know:
            //  a) we didn't connect
            //  b) why we didn't connect (if we need to go to the homepage or not)
            return;
        }

        const result = await response.json();

        this.game_id = result.room_id;
        this.user_id = result.user_id;
        this.is_initialized = true;

        this.connect();
    }

    getGame(): Game_ {
        return new Game_(this.game);
    }

    // Commands that a host can activate on this object ======================
    sendGetGame(): void {
        this.send(MessageMethod.GetState);
    }

    sendRemovePlayer(user_id: string): void {
        let data = {
            user_id: user_id,
        }
        
        this.send(MessageMethod.RemovePlayer, data);
    }

    sendOpenRoom(): void {
        this.send(MessageMethod.OpenRoom);
    }

    sendCloseRoom(): void {
        this.send(MessageMethod.CloseRoom);
    }

    sendStartGame(): void {
        this.send(MessageMethod.StartGame);
    }

    sendNextQuestion(): void {

    }

    sendCorrectAnswer(): void {

    }

    sendIncorrectAnswer(): void {

    }

    // Private methods =======================================================
    private async connect(): Promise<void> {
        if (this.is_initialized !== true) {
            return;
        }

        this.socket = new WebSocket(`ws://localhost:3000/?user_id=${this.user_id}&game_id=${this.game_id}`);

        this.socket.onopen = () => {
            this.sendGetGame();
        }

        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);

            console.log(message);

            // Parse message into variables ==================================
            let players: Player[] = [];

            for (const p of message.game.players) {
                let new_player = {
                    id: p.id,
                    username: p.username,
                    status: PlayerStatus[p.status.name as keyof typeof PlayerStatus],
                    points: p.points
                } as Player;
                players.push(new_player)
            }

            let gameStatus = GameState[message.game.status.name as keyof typeof GameState];
            let isOpen = message.game.isOpen as boolean;
            let gameCode = message.game.passcode as string;

            // Update the game variables =====================================
            this.game.setPlayers(players);
            this.game.setStatus(gameStatus);
            this.game.setIsOpen(isOpen);
            this.game.setGameCode(gameCode);

            this.emit(GameManagerEvents.update);
        }

        this.socket.onclose = (event) => {
            let code = event.code;
            console.log(`code: ${code}`);
        }
    }

    private async send(method: MessageMethod, data?: any): Promise<void> {
        if (this.socket === undefined) {
            return;
        }

        let message  = {
            method: method,
            timestamp: Date.now(),
            data: data,
        }

        this.socket.send(JSON.stringify(message));
    }
}

export default new GameManager();