import styles from './score-card.module.css';

interface ScoreCardProps {
    username: string,
    points: number,
}

export default function ScoreCard ( {username, points}: ScoreCardProps) {
    return (
        <div className={styles.scoreCardWrapper}>
            <div className={styles.scoreCard}>
                <h1> Username: {username} </h1>
                <h2> Points: {points} </h2>
            </div>
        </div>
    )
}