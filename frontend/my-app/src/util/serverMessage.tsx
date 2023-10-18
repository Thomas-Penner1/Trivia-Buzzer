import { GamePrototype, Game_ } from "@/data-structures/game";
import { MessageMethod } from "./enums/MessageMethod";
import { Player } from "@/data-structures/player";
import { PlayerStatus } from "./enums/PlayerStatus";
import { GameState } from "./enums/GameState";



export interface PlayerData {
    player: Player,
    activePlayer?: Player,
}


/**
 * message_id:  id of this message
 * response_id: id of the message the server is replying to, if applicable
 * sender_id:   id of the user
 * 
 * method: the action that this message corresponds to
 * timestamp: the time that the message was sent
 * 
 */
export interface ServerMessage {
    message_id:   string;
    sender_id:    string;
    response_id?: string;

    method: MessageMethod;
    timestamp: number;
    message_type: string;

    playerData?: PlayerData;
    game?: Game_;
    data?: any;
}



export function ProcessServerMessage(server_message: string) {
    let message = JSON.parse(server_message);
    console.log(message.method);
    console.log(MessageMethod[message.method.trim() as keyof typeof MessageMethod])
    console.log(message);

    let output = {
        message_id: message.id,
        sender_id: message.sender,
        response_id: message.response_id ? message.response_id : undefined,

        method: MessageMethod[message.method as keyof typeof MessageMethod],
        timestamp: message.timestamp,
        message_type: message.message_type,

        data: message.data ? message.data : undefined,
    } as ServerMessage;

    if (message.message_type === "HOST") {
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

        let game_prototype = {
            players: players,
            status: gameStatus,
            isOpen: isOpen,
            gameCode: gameCode,

        } as GamePrototype;

        output.game = new Game_(game_prototype);

    } else if (message.message_type === "PLAYER") {
        let player = {
            id: message.player.id,
            points: Number(message.player.points),
            status: PlayerStatus[message.player.status.name as keyof typeof PlayerStatus],
            username: message.player.username ? message.player.username : undefined,
        }

        let active_player = undefined;

        if (message.active_player) {
            active_player = {
                id: message.active_player.id,
                points: Number(message.active_player.points),
                status: PlayerStatus[message.active_player.status.name as keyof typeof PlayerStatus],
                username: message.active_player.username ? message.active_player.username : undefined,
            } as Player;
        }

        output.playerData = {
            player: player,
            activePlayer: active_player,
        } as PlayerData;
    }

    console.log(output);

    return output;
}