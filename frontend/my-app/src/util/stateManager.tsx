import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";
import EventEmitter from "events";
import { GameState } from "./enums/GameState";
import { Game } from "@/data-structures/game";
import { PlayerController } from "@/data-structures/player-controller";

// NOTE: This class does not do any validation. It is intended to just
// facilitate the two-way connection between the client and the server
class AppManager extends EventEmitter {
    // Events this object can emit ===========================================
    ConnectEvent               = "connect";
    
    CloseEvent_GameEnd         = "close:game-end";
    CloseEvent_PlayerRemoved   = "close:player-remove";
    CloseEvent_ServerClosed    = "close:server-closed";

    ContinueEvent_NextQuestion = "continue:next-question";

    AnswerEvent_Correct        = "answer:correct";
    AnswerEvent_Incorrect      = "answer:incorrect";

    JoinEvent_NewPlayer        = "join:new-player";
    JoinEvent_Username         = "join:username";
    JoinEvent_PlayerLeave      = "join:player-leave"

    PasscodeEvent              = "passcode";

    BuzzEvent                  = "buzz";

    // Failure events
    SuccessEvent_Username      = "success:username";
    SuccessEvent_StartGame     = "success:startgame";
    SuccessEvent_Buzz          = "success:buzz";

    // Success events
    FailureEvent_Username      = "failure:username";
    FailureEvent_StartGame     = "failure:startgame";
    FailureEvent_Buzz          = "failure:buzz";

    // Members for sending values ============================================
    static _Send_JoinHost        = "join-host";
    static _Send_JoinPlayer      = "join-player";
    static _Send_SetUsername     = "set-username";
    static _Send_OpenRoom        = "open-room";
    static _Send_CloseRoom       = "close-room";
    static _Send_RemovePlayer    = "remove-player";
    static _Send_StartGame       = "start-game";
    static _Send_AssignPoints    = "assign-points";
    static _Send_IncorrectAnswer = "incorrect-answer";
    static _Send_CorrectAnswer   = "correct-answer";
    static _Send_NextQuestion    = "next-question";
    static _Send_Buzz            = "buzz";

    // Members for receiving values ==========================================
    static _Receive_PlayerJoin      = "player-join";
    static _Receive_Username        = "set-username";
    static _Receive_Connection      = "connect";
    static _Receive_Buzz            = "buzz";
    static _Receive_StartGame       = "start-game";
    static _Receive_NextQuestion    = "next-question";
    static _Receive_CorrectAnswer   = "correct-answer";
    static _Receive_IncorrectAnswer = "incorrect-answer";
    static _Receive_Passcode        = "passcode";

    static _Receive_Success         = "success";
    static _Receive_Failure         = "failure";

    // Members for error codes ===============================================
    static _Close_GameEnd = 4000;
    static _Close_Removed = 4001;

    // APP ===================================================================
    socket?: WebSocket;

    game_id: string;
    user_id?: string;
    is_host?: boolean;
    is_initialized: boolean;

    // Variable for keeping track of player state
    player?: PlayerController;

    // Variable for keeping track of game state
    game?: Game;

    constructor() {
        super();

        this.game_id = "";
        this.is_initialized = false;
    }

    // Initializes the game from the app's perspective, but because we are
    // sharing an instance as a singleton, we require a later init state
    initialize(game_id: string, user_id: string, is_host: boolean): void {
        this.game_id = game_id;
        this.user_id = user_id;
        this.is_host = is_host;
        this.is_initialized = true;

        if (this.is_host === true && this.game === undefined) {
            this.game = new Game();

        } else {
            let temp_player = {
                id: user_id,
                points: 0,
                status: PlayerStatus.Pending,
            } as Player;

            this.player = new PlayerController(temp_player);
        }
    }

    // Methods for players ===================================================
    getPlayer(): PlayerController {
        if (this.player === undefined) {
            let temp_player = {
                id: this.user_id,
                points: 0,
                status: PlayerStatus.Pending,
            } as Player;

            this.player = new PlayerController(temp_player);
            return this.player;
        }

        return this.player;
    }

    buzz(): void {
        if (this.is_host !== false) {
            return;
        }

        let data = {
            time: Date.now(),
        }

        this._send(AppManager._Send_Buzz, data);
    }

    setUsername(username: string): void {
        if (this.is_host !== false) {
            return;
        }

        let data = {
            username: username,
        }

        this._send(AppManager._Send_SetUsername, data)
    }


    // Methods for hosts =====================================================
    getGame() : Game{
        if (this.game === undefined) {
            this.game = new Game();
            return this.game;
        }

        return this.game;
    }

    removePlayer(user_id: string): void {
        if (this.is_host !== true) {
            return;
        }

        let data = {
            user_id: user_id
        }

        this._send(AppManager._Send_RemovePlayer, data);
    }

    openRoom(): void {
        if (this.is_host !== true) {
            return;
        }

        this._send(AppManager._Send_OpenRoom);
    }

    closeRoom(): void {
        if (this.is_host !== true) {
            return;
        }

        this._send(AppManager._Send_CloseRoom);
    }

    async startGame(): Promise<void> {
        if (this.is_host !== true) {
            return;
        }

        this._send(AppManager._Send_StartGame);
    }

    async correctAnswer(user_id: string): Promise<void> {
        let data = {
            user_id: user_id,
        }

        this._send(AppManager._Send_CorrectAnswer, data);
    }

    async incorrectAnswer(user_id: string): Promise<void> {
        let data = {
            user_id: user_id,
        }

        this._send(AppManager._Send_IncorrectAnswer, data);
    }

    assignPoints(user_id: string, points?: number): void {
        if (this.is_host !== true) {
            return;
        }

        let points_assigned: number;

        if (points !== undefined) {
            points_assigned = points;
        } else {
            points_assigned = 1;
        }

        let data = {
            user_id: user_id,
            points: points_assigned,
        }

        this._send(AppManager._Send_AssignPoints, data);
    }

    nextQuestion(): void {
        if (this.is_host !== true) {
            return;
        }

        this._send(AppManager._Send_NextQuestion);
    }

    

    

    

    // Private methods =======================================================

    // initiates a connection with the backend database, and defines the 
    // behaviour for receiving a message
    //
    // does nothing if the app has not been initialized
    connect(): void {
        if (this.is_initialized === undefined || !this.is_initialized || this.socket !== undefined) {
            return;
        }

        this.socket = new WebSocket(`ws://localhost:3000/?user_id=${this.user_id}&game_id=${this.game_id}`);

        this.socket.onopen = () => {
            let method: string;

            if (this.is_host) {
                method = AppManager._Send_JoinHost;
            } else {
                method = AppManager._Send_JoinPlayer;
            }

            this._send(method);
        }

        this.socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            let method = message.method;

            if (method === AppManager._Receive_Buzz) {
                this.emit(this.BuzzEvent, message.data.user_id);

            } else if (method === AppManager._Receive_Connection) {
                this.emit(this.ConnectEvent);

            } else if (method === AppManager._Receive_CorrectAnswer) {
                console.log(message);
            } else if (method === AppManager._Receive_IncorrectAnswer) {
                console.log(message);
            } else if (method === AppManager._Receive_NextQuestion) {
                console.log(message);
            } else if (method === AppManager._Receive_PlayerJoin) {
                // A hack for types to match up
                let player_status = PlayerStatus[message.data.status.name as keyof typeof PlayerStatus];

                let new_player = {
                    id: message.data.id as string,
                    status: player_status,
                    points: 0,
                } as Player;

                this.emit(this.JoinEvent_NewPlayer, new_player);

            } else if (method === AppManager._Receive_StartGame) {
                this.emit(this.ContinueEvent_NextQuestion);

            } else if (method === AppManager._Receive_Username) {
                let player = {
                    id: message.data.id,
                    username: message.data.username,
                    status: PlayerStatus.Ready,
                    points: 0,
                }

                this.emit(this.JoinEvent_Username, player);

            } else if (method === AppManager._Receive_Passcode) {
                let code = message.data.passcode as string;
                this.emit(this.PasscodeEvent, code);

            } else if (method === AppManager._Receive_Success) {
                let success_method = message.data.method as string;

                if (success_method === AppManager._Send_SetUsername) {
                    this.emit(this.SuccessEvent_Username);

                } else if (success_method === AppManager._Send_StartGame) {
                    this.emit(this.SuccessEvent_StartGame);

                } else if (success_method === AppManager._Send_Buzz) {
                    this.emit(this.SuccessEvent_Buzz);
                }
                
            } else if (method === AppManager._Receive_Failure) {
                let success_method = message.data.method as string;

                if (success_method === AppManager._Send_SetUsername) {
                    this.emit(this.FailureEvent_Username);

                } else if (success_method === AppManager._Send_StartGame) {
                    this.emit(this.FailureEvent_StartGame);

                } else if (success_method === AppManager._Send_Buzz) {
                    this.emit(this.FailureEvent_Buzz);
                }
            }
        }

        this.socket.onclose = (event) => {
            let code = event.code

            switch (code) {
                case AppManager._Close_GameEnd:
                    this.emit(this.CloseEvent_GameEnd);
                    break;
                
                case AppManager._Close_Removed:
                    this.emit(this.CloseEvent_PlayerRemoved);
                    break;

                // The server closed the connection (who knows why?)
                default:
                    this.emit(this.CloseEvent_ServerClosed);
                    break;
            }
        }
    }

    private _send(method: string, data?: any): void {
        let message = {
            method: method,
            data: data,
        }

        this.socket?.send(JSON.stringify(message));
    }
};

export const StateManager = new AppManager();