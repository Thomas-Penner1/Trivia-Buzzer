import { GameState } from "@/util/enums/GameState";
import { Player } from "./player";
import { StateManager } from "@/util/stateManager";
import EventEmitter from "events";
import { PlayerStatus } from "@/util/enums/PlayerStatus";

// Handles all of the game functionality for the user
// Lets the user know when there are changes through events, so that the
// webpage can update automatically
export class Game extends EventEmitter {
    id: string;
    players: Player[];
    status: GameState;
    isOpen: boolean;
    gameCode?: string;

    // Events that can be emmitted by this object ============================
    // Note: keeping this simple for now, but will add events depending on
    // the level of granularity our UI needs

    // Emmitted by this object whenever the game code is updated
    get GameCodeEvent () {
        return "GameCodeEvent";
    }

    // Emmitted when the players array gets updated
    get PlayerEvent () {
        return "PlayerEvent";
    }

    // Method definitions ====================================================
    constructor(id: string) {
        super();

        this.id = id;
        this.players = [];
        this.status = GameState.Pending;
        this.isOpen = true;
        
        // Event listeners for object modification
        StateManager.addListener(StateManager.PasscodeEvent, (passcode: string) => {
            this.setGameCode(passcode);
            this.emit(this.GameCodeEvent);
        });

        StateManager.addListener(StateManager.JoinEvent_NewPlayer, (player: Player) => {
            this.addPlayer(player);

            this.emit(this.PlayerEvent);
        })

        StateManager.addListener(StateManager.JoinEvent_Username, (player: Player) => {
            if (player.username === undefined) {
                return;
            }

            this.setUsername(player.id, player.username);

            this.emit(this.PlayerEvent);
        })

        // StateManager.addListener(StateManager.JoinEvent_PlayerLeave, () => {

        // })

        // TODO: figure out how we want to implement buzzes on the front end
        StateManager.addListener(StateManager.BuzzEvent, (user_id: string) => {
            let player_idx = this.players.findIndex((player) => player.id === user_id);
            let player = this.players[player_idx];

            player.status = PlayerStatus.Buzz;

            this.players[player_idx] = player;
        });
    }

    // Actions that are triggered by events ==================================
    // Q: Should this wrap around the stateManager values?
    addPlayer(player: Player): void {
        this.players.push(player);
    }

    setGameCode(gameCode: string): void {
        this.gameCode = gameCode;
        this.status = GameState.Ready;
    }

    setUsername(user_id: string, username: string) {
        let player_idx = this.players.findIndex((player) => player.id === user_id);
        let player = this.players[player_idx];

        player.username = username;
        player.status = PlayerStatus.Ready;

        this.players[player_idx] = player;
    }

    // Events that are triggered by users ====================================
    removePlayer(val: string | number) {
        if (typeof val === 'number') {
            this.removePlayerByIndex(val)
        } else {
            this.removePlayerById(val);
        }

        this.emit(this.PlayerEvent);
    }

    togglePolling() {
        if (this.isOpen) {
            StateManager.closeRoom();
        } else {
            StateManager.openRoom();
        }

        this.isOpen = !this.isOpen;
    }

    startGame() {
        StateManager.startGame();
        this.status = GameState.Active;
    }

    nextQuestion() {

    }

    // These are tied to the user_id that buzzed in
    correctAnswer() {

    }

    incorrectAnswer() {

    }

    // Less useful helper functions ==========================================
    removePlayerById(user_id: string) {
        this.players = this.players.filter(item => item.id !== user_id)
    }

    removePlayerByIndex(index: number) {
        this.players.splice(index, 1);
    }
}