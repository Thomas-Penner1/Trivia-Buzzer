'use client'

import { useRouter } from "next/navigation";

import ScoreCard from "@/components/score-card"
import { usePlayer } from "@/context/GameContext";
import { useEffect, useState } from "react";
import { PlayerStatus } from "@/util/enums/PlayerStatus";
import { AppNotification } from "@/components/Notification";
// import { StateManager } from "@/util/stateManager";

// This is a waiting room for the players who are participating in the room
export default function WaitingPage() {
    const router = useRouter();

    const playerState = usePlayer();

    useEffect(() => {
        if (playerState.player.status === PlayerStatus.Active) {
            router.push('.');
        }
    })

    const [displayCorrect, setDisplayCorrect] = useState(playerState.player.status === PlayerStatus.Correct)
    const [displayIncorrect, setDisplayIncorrect] = useState(playerState.player.status === PlayerStatus.Incorrect)

    // let displayCorrect = playerState.player.status === PlayerStatus.Correct;
    // let displayIncorrect = playerState.player.status === PlayerStatus.Incorrect;

    let username = playerState.player.username as string;
    let points = playerState.player.points;
    
    return (
        <main>
            <ScoreCard username={username} points={points} />

            { displayCorrect ? <AppNotification
                message={"You answered correctly"}
                transitionDuration={500}
                callback={() => {setDisplayCorrect(false)}}
            /> : null}

            { displayIncorrect ? <AppNotification
                message={"You answered incorrectly"}
                transitionDuration={500}
                callback={() => {setDisplayIncorrect(false)}}
            /> : null}
        </main>
    )
}