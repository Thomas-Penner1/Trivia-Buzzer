import { GameState } from "@/util/enums/GameState";
import { Player } from "./player";
// import { StateManager } from "@/util/stateManager";
import EventEmitter from "events";
import { PlayerStatus } from "@/util/enums/PlayerStatus";


export interface GamePrototype {
    players: Player[];
    status: GameState;
    isOpen: boolean;
    gameCode: string;
}


// The class that we are moving the game to
export class Game_ {
    private players: Player[];
    private status: GameState;
    private isOpen: boolean;
    private gameCode: string;

    /**
     * Creates a new Game object. If game is undefined, it creates an newly
     * initialized game, and if game is provided, it creates a copy of the
     * object
     * @param game 
     */
    constructor(game?: Game_ | GamePrototype) {
        if (game === undefined) {
            this.players  = [];
            this.status   = GameState.Pending;
            this.isOpen   = false;
            this.gameCode = "";

        } else if (game instanceof Game_) {
            this.players  = game.getPlayers();
            this.status   = game.getStatus();
            this.isOpen   = game.getIsOpen();
            this.gameCode = game.getGameCode();

        } else {
            this.players  = game.players;
            this.status   = game.status;
            this.isOpen   = game.isOpen;
            this.gameCode = game.gameCode;
        }
    }

    // Getters ===============================================================
    getPlayers() {
        return [...this.players]
    }

    getStatus() {
        return this.status;
    }

    getIsOpen() {
        return this.isOpen;
    }

    getGameCode() {
        return this.gameCode;
    }

    // Setters ===============================================================
    setPlayers(players: Player[]) {
        this.players = [...players];
    }

    setStatus(gameStatus: GameState): void {
        this.status = gameStatus;
    }

    setIsOpen(isOpen: boolean): void {
        this.isOpen = isOpen;
    }

    setGameCode(gameCode: string): void {
        this.gameCode = gameCode;
    }
}

// Handles all of the game functionality for the user
// Lets the user know when there are changes through events, so that the
// webpage can update automatically
// export class Game extends EventEmitter {
//     players: Player[];
//     status: GameState;
//     isOpen: boolean;
//     gameCode?: string;

//     // Events that can be emmitted by this object ============================
//     // Note: keeping this simple for now, but will add events depending on
//     // the level of granularity our UI needs

//     // Emmitted by this object whenever the game code is updated
//     get GameCodeEvent () {
//         return "GameCodeEvent";
//     }

//     // Emmitted when the players array gets updated
//     get PlayerEvent () {
//         return "PlayerEvent";
//     }

//     // Emmitted when a player buzzes in
//     get BuzzEvent() {
//         return "BuzzEvent";
//     }

//     // Method definitions ====================================================
//     constructor() {
//         super();

//         this.players = [];
//         this.status = GameState.Pending;
//         this.isOpen = true;
        
//         // Event listeners for object modification
//         StateManager.addListener(StateManager.PasscodeEvent, (passcode: string) => {
//             this.setGameCode(passcode);
//             this.emit(this.GameCodeEvent);
//         });

//         StateManager.addListener(StateManager.JoinEvent_NewPlayer, (player: Player) => {
//             this.addPlayer(player);

//             this.emit(this.PlayerEvent);
//         })

//         StateManager.addListener(StateManager.JoinEvent_Username, (player: Player) => {
//             if (player.username === undefined) {
//                 return;
//             }

//             this.setUsername(player.id, player.username);

//             this.emit(this.PlayerEvent);
//         })

//         // StateManager.addListener(StateManager.JoinEvent_PlayerLeave, () => {

//         // })

//         // TODO: figure out how we want to implement buzzes on the front end
//         StateManager.addListener(StateManager.BuzzEvent, (user_id: string) => {
//             // let player_idx = this.players.findIndex((player) => player.id === user_id);
//             // let player = this.players[player_idx];

//             // player.status = PlayerStatus.Buzz;

//             // this.players[player_idx] = player;
//             this.emit(this.BuzzEvent, user_id);
//         });
//     }

//     // Actions that are triggered by events ==================================
//     // Q: Should this wrap around the stateManager values?
//     addPlayer(player: Player): void {
//         this.players.push(player);
//     }

//     setGameCode(gameCode: string): void {
//         this.gameCode = gameCode;
//         this.status = GameState.Ready;
//     }

//     setUsername(user_id: string, username: string) {
//         let player_idx = this.players.findIndex((player) => player.id === user_id);
//         let player = this.players[player_idx];

//         player.username = username;
//         player.status = PlayerStatus.Ready;

//         this.players[player_idx] = player;
//     }

//     // Events that are triggered by users ====================================
//     removePlayer(val: string | number) {
//         if (typeof val === 'number') {
//             this.removePlayerByIndex(val)
//         } else {
//             this.removePlayerById(val);
//         }

//         this.emit(this.PlayerEvent);
//     }

//     togglePolling() {
//         if (this.isOpen) {
//             StateManager.closeRoom();
//         } else {
//             StateManager.openRoom();
//         }

//         this.isOpen = !this.isOpen;
//     }

//     startGame() {
//         this.status = GameState.Active;
//         this.players = this.players.map(player => {
//             return {
//                 id: player.id,
//                 points: player.points,
//                 username: player.username,
//                 status: player.status === PlayerStatus.Ready ? PlayerStatus.Active : PlayerStatus.Pending,
//             } as Player
//         });
        
//         StateManager.startGame();
//     }

//     nextQuestion() {
        
//     }

//     // These are tied to the user_id that buzzed in
//     correctAnswer(user_id: string) {
//         function getStatus(player: Player): PlayerStatus {
//             if (player.id === user_id) {
//                 return PlayerStatus.Active;
//             } else if (player.status === PlayerStatus.Active) {
//                 return PlayerStatus.Incorrect;
//             } else {
//                 return player.status;
//             }
//         }

//         function getPoints(player: Player): number {
//             if (player.id === user_id) {
//                 return player.points + 1;
//             } else {
//                 return player.points;
//             }
//         }

//         this.players = this.players.map(player => {
//             return {
//                 id: player.id,
//                 points: getPoints(player),
//                 username: player.username,
//                 status: getStatus(player),
//             } as Player;
//         })

//         StateManager.correctAnswer(user_id);
//     }

//     incorrectAnswer(user_id: string) {
//         let player_idx = this.players.findIndex((player) => player.id === user_id);
//         let player = this.players[player_idx];

//         player.status = PlayerStatus.Incorrect;

//         this.players[player_idx] = player;

//         StateManager.incorrectAnswer(user_id);
//     }

//     // Less useful helper functions ==========================================
//     removePlayerById(user_id: string) {
//         this.players = this.players.filter(item => item.id !== user_id)
//     }

//     removePlayerByIndex(index: number) {
//         this.players.splice(index, 1);
//     }
// }