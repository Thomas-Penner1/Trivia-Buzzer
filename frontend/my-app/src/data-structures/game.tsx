import { GameState } from "@/util/enums/GameState";
import { Player } from "./player";

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
