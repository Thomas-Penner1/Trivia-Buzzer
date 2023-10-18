import { EventEmitter } from "events";
import { MessageMethod } from "./enums/MessageMethod";
import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";
import { GameState } from "./enums/GameState";
import { Game_ } from "@/data-structures/game";

import { v4 as uuidv4 } from 'uuid';
import { ProcessServerMessage } from "./serverMessage";
import { PostiveNegativeTimeout } from "./positiveNegativeTimeout";


interface SocketMessage {
    method: string;
    timestamp: number;
    sender: string;
}


export enum UserSocketEvent {
    CONNECT    = "CONNECT",
    GAME       = "GAME",
    PLAYER     = "PLAYER",
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
    UNKOWN_REASON:         1006,
    
    SERVER_ENDED_GAME:     4000,

    HOST_REMOVED_USER:     4100,
    HOST_LEFT_GAME:        4101,
    HOST_ENDED_GAME:       4102,

    USER_ENDED_CONNECTION: 4200,
} as const;

type UserSocketCloseReasonKey = typeof UserSocketCloseReason[keyof typeof UserSocketCloseReason];

export class UserSocket extends EventEmitter {
    private socket: WebSocket;
    private activeMessages: Map<string, (arg0: any) => any>

    // "Last State" variables - variables that are updated to reflect the most recent
    // message received
    currentGame: Game_;
    currentPlayer: Player;
    currentActivePlayer?: Player;

    socketState: UserSocketState;
    socketCloseReason?: number;

    constructor(game_id: string, user_id: string) {
        super();

        this.currentGame = new Game_();
        this.currentPlayer = {
            id: "",
            points: 0,
            status: PlayerStatus.Pending,

        } as Player

        this.socketState = UserSocketState.CONNECTING;
        this.activeMessages = new Map();

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

    requestSetUsername(username: string, callback: (arg0: any) => any): void {
        let data = {
            username: username,
        }
        
        this.request(MessageMethod.SetUsername, callback, data);
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

    // Sends a message to the server. Returns the ID of the message sent
    private send(method: MessageMethod, data?: any) {
        if (this.socket === undefined) {
            return;
        }

        const id: string = uuidv4() as string;

        let message = {
            id: id,
            method: method,
            timestamp: Date.now(),
            data: data,
        }

        this.socket.send(JSON.stringify(message));

        return id;
    }

    // Sends a request to the server, and expects information back
    private async request(
            method: MessageMethod, 
            callback: (arg0: any) => any, 
            data?: any
    ) {
        let id = this.send(method, data);

        // we didn't send the message
        if (id === undefined) {
            return;
        }

        this.activeMessages.set(id, callback);
    }

    private addMessageMethod() {
        this.socket.onmessage = (event) => {
            let message = ProcessServerMessage(event.data);

            // If someone is waiting on this data, then we can send them
            // the information right away :)
            if (message.response_id) {
                let fn = this.activeMessages.get(message.response_id)

                if (fn !== undefined) {
                    fn(message.data);
                }

                this.activeMessages.delete(message.response_id);
            }

            if (message.message_type === "HOST") {
                if (message.game) {
                    this.currentGame = message.game;
                }

                this.emit(UserSocketEvent.GAME);
            }

            if (message.message_type === "PLAYER") {
                if (message.playerData) {
                    this.currentPlayer = message.playerData.player;
                    this.currentActivePlayer = message.playerData.activePlayer;
                }
                
                this.emit(UserSocketEvent.PLAYER);
            }
        }
    }

    private addOpenMethod() {
        this.socket.onopen = () => {
            this.socketState = UserSocketState.OPEN;
            this.emit(UserSocketEvent.CONNECT);
        }
    }

    private addErrorMethod() {
        this.socket.onerror = () => {
            this.socketState = UserSocketState.ERROR;
        }
    }

    private addCloseMethod() {
        this.socket.onclose = (event) => {
            this.socketState = UserSocketState.CLOSED;
            this.socketCloseReason = event.code;
            this.emit(UserSocketEvent.CLOSE);
        }
    }
}