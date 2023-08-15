import { Player } from "@/data-structures/player"

import PlayerDisplay from "./player"
import { PlayerStatus } from "@/util/enums/PlayerStatus";

import styles from './game-board.module.css'

interface GameBoardDisplayProps {
    players: Player[],
    setUp: boolean,
    removePlayer: Function,
    buzz_id?: string
}

function isActive(player: Player, setUp: boolean) {
    if (setUp) {
        return player.status === PlayerStatus.Ready;
    } else {
        return true;
    }
}

export default function GameBoard({players, setUp, removePlayer, buzz_id}: GameBoardDisplayProps) {
    let activePlayers = players.filter(player => isActive(player, setUp));
    let pendingPlayers = players.filter(player => player.status === PlayerStatus.Pending);

    return (
        <div className={styles.playerHolderOuter}>
            <div className={styles.playerHolderInner}>
                <div className={styles.playerHolder}>
                    <ul className={styles.playerHolderList}>
                        {activePlayers.map(
                            (player, idx) => (
                                <li key={player.id}>
                                    <PlayerDisplay player={player} removePlayer={removePlayer} index={idx}/>
                                </li>
                            )
                        )}
                        
                    </ul>
                </div>

                <div>
                    Pending Players: {pendingPlayers.length}
                </div>
            </div>
        </div>
    )
}