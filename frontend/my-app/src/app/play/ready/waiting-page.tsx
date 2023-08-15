'use client'

import { useRouter } from "next/navigation";

import ScoreCard from "@/components/score-card"
import { StateManager } from "@/util/stateManager";

// This is a waiting room for the players who are participating in the room
export default function WaitingPage() {
    const router = useRouter();

    // We only want to register this event provided that the game has not started
    StateManager.once(StateManager.ContinueEvent_NextQuestion, () => {
        console.log("here");
        router.push('.');
    })

    let Player = StateManager.getPlayer();

    let username = Player.username as string;
    let points = Player.points;
    
    return (
        <main>
            <ScoreCard username={username} points={points} />
        </main>
    )
}