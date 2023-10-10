import { EventEmitter } from "events";
import { MessageMethod } from "./enums/MessageMethod";
import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";
import { GameState } from "./enums/GameState";


export enum UserSocketEvent {
    CONNECT    = "CONNECT",
    GAME       = "GAME",
    DISCONNECT = "DISCONNECT",
    CLOSE      = "CLOSE",
}

export enum UserSocketState {
    CONNECTING,
    OPEN,
    DISCONNECTED,
    CLOSED,
    ERROR,
}

export const UserSocketCloseReason = {
    HOST_REMOVED_USER:     4100,
    HOST_LEFT_GAME:        4101,
    HOST_ENDED_GAME:       4102,

    USER_ENDED_CONNECTION: 4200,

    UNKOWN:                4999,

} as const;

type UserSocketCloseReasonKey = typeof UserSocketCloseReason[keyof typeof UserSocketCloseReason];

export class UserSocket extends EventEmitter {
    private socket: WebSocket;
    socketState: UserSocketState;
    socketCloseReason?: number;

    constructor(game_id: string, user_id: string) {
        super();

        this.socketState = UserSocketState.CONNECTING;

        this.socket = new WebSocket(`ws://localhost:3000/?user_id=${user_id}&game_id=${game_id}`);
        
        // Initialize the socket's events
        this.addOpenMethod();
        this.addMessageMethod();
        this.addErrorMethod();
        this.addCloseMethod();
    }

    sendGetGame(): void {
        this.send(MessageMethod.GetState);
    }

    close(code?: UserSocketCloseReasonKey, reason?: string): void {
        this.socket.close(code, reason);
        this.socketState = UserSocketState.CLOSED;
        this.socketCloseReason = UserSocketCloseReason.USER_ENDED_CONNECTION;
    }

    sendRemovePlayer(user_id: string): void {
        let data = {
            user_id: user_id,
        }
        
        this.send(MessageMethod.RemovePlayer, data);
    }

    // HOST SEND METHODS ======================================================
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
        this.send(MessageMethod.NextQuestion);
    }

    sendCorrectAnswer(): void {
        this.send(MessageMethod.CorrectAnswer);
    }

    sendIncorrectAnswer(): void {
        this.send(MessageMethod.IncorrectAnswer);
    }

    endGame(): void {
        this.close(UserSocketCloseReason.USER_ENDED_CONNECTION);
    }

    // USER SEND METHODS ======================================================
    sendBuzz() {
        this.send(MessageMethod.Buzz);
    }

    sendSetUsername(username: string): void {
        let data = {
            username: username,
        }

        this.send(MessageMethod.SetUsername, data);
    }

    leaveGame(): void {
        this.close(UserSocketCloseReason.USER_ENDED_CONNECTION);
    }

    // PRIVATE ================================================================
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

    private addMessageMethod() {
        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);

            // Parse message into variables
            let players: Player[] = [];

            for (const p of message.game.players) {
                let new_player = {
                    id: p.id,
                    username: p.username,
                    status: PlayerStatus[p.status.name as keyof typeof PlayerStatus],
                    points: p.points
                } as Player;

                players.push(new_player);
            }

            let gameStatus = GameState[message.game.status.name as keyof typeof GameState];
            let isOpen = message.game.isOpen as boolean;
            let gameCode = message.game.passcode as string;

            this.emit(UserSocketEvent.GAME);
        }
    }

    private addOpenMethod() {
        this.socket.onopen = () => {
            this.socketState = UserSocketState.OPEN;
            this.emit(UserSocketEvent.CONNECT);
        }
    }

    private addErrorMethod() {
        this.socketState = UserSocketState.ERROR;
    }

    private addCloseMethod() {
        this.socket.onclose = (event) => {
            this.socketState = UserSocketState.CLOSED;
            this.socketCloseReason = event.code;
            this.emit(UserSocketEvent.CLOSE);
        }
    }
}