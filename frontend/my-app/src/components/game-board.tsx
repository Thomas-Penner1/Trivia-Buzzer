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
        return (
            player.status === PlayerStatus.Active || 
            player.status === PlayerStatus.Buzz ||
            player.status === PlayerStatus.Correct ||
            player.status === PlayerStatus.Incorrect
        );
    }
}

function isWaiting(player: Player, setUp: boolean) {
    return (!setUp) && player.status === PlayerStatus.Ready;
}

function isPending(player: Player, setUp: boolean) {
    return player.status === PlayerStatus.Pending;
}

export default function GameBoard({players, setUp, removePlayer, buzz_id}: GameBoardDisplayProps) {
    // let _players: Player[] = []

    // for (let i = 0; i < 20; ++i) {
    //     _players.push({
    //         id: i.toString(),
    //         username: 'user-' + i.toString(),
    //         points: i,
    //         status: PlayerStatus.Ready,
    //     } as Player)
    // }

    // console.log(_players);
    
    let activePlayers = players.filter(player => isActive(player, setUp));
    let pendingPlayers = players.filter(player => isPending(player, setUp));
    let waitingPlayers = players.filter(player => isWaiting(player, setUp));

    let leaderBoard = [...activePlayers];
    leaderBoard.sort((a, b) => {return b.points - a.points});

    console.log(players);
    

    return (
        <div className={styles.playerHolderOuter}>
            <div className={styles.playerHolderInner}>
                <div className={styles.playerHolder}>
                    <div className={styles.sectionTitle}>
                        Players
                    </div>
                    <ul className={styles.playerHolderList}>
                        {activePlayers.map(
                            (player, idx) => (
                                <li key={player.id}>
                                    <PlayerDisplay 
                                        player={player} 
                                        removePlayer={removePlayer} 
                                        index={player.id}
                                        buzz={player.status === PlayerStatus.Incorrect}
                                    />
                                </li>
                            )
                        )}
                        
                    </ul>
                </div>

                <div className={styles.boardRight}>
                    <div className={styles.sectionTitle}>
                        LeaderBoard
                    </div>
                    <div className={styles.leaderBoardWrapper}>
                        <table className={styles.leaderBoard}>
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Username</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderBoard.map((val, idx) => {
                                    return (
                                        <tr key={val.id}>
                                            <td>{idx + 1}</td>
                                            <td>{val.username}</td>
                                            <td>{val.points}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}