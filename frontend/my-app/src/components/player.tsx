import styles from "./player.module.css";

import { Player } from "@/data-structures/player"


interface PlayerDisplayProps {
    player: Player,
    removePlayer: Function,
    index: string,
    buzz?: boolean,
}

export default function PlayerDisplay({player, removePlayer, index, buzz}: PlayerDisplayProps) {
    
    return (
        <div 
            className={`${styles.player} ${buzz === true ? styles.playerBuzz : styles.playerNoBuzz}`} 
            onClick={() => removePlayer(index)}
        >
            
            <div className={styles.playerUsername}>
                {player.username === undefined ? "" : player.username}
            </div>
            
            {/* <div className={styles.playerPoints}>
                points:{player.points}
            </div> */}
        </div>
    )
}