'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ScoreCard from "@/components/score-card";

import buzzerStyles from "../../styles/buzzer.module.css"
import { StateManager } from "@/util/stateManager";
import { PlayerStatus } from "@/util/enums/PlayerStatus";

export default function Play() {
    const router = useRouter();

    const [disabled, setDisabled] = useState( false );

    let Player = StateManager.getPlayer();

    let username = Player.username as string;
    let points = Player.points;

    useEffect(() => {
        // Remove all listeners currently set up
        Player.removeAllListeners();

        Player.addListener(Player.SuccessBuzzEvent, () => {
            Player.setState(PlayerStatus.Buzz);

            // Update the necessary state variables
        });

        // Not sure whether or not we need to do anything here
        Player.addListener(Player.FailBuzzEvent, () => {
        });

        Player.addListener(Player.CorrectAnswerEvent, () => {
            Player.setState(PlayerStatus.Active);
        });

        Player.addListener(Player.IncorrectAnswerEvent, () => {
            // We need to set their buzzer to disabled, and set the
            // player state accordingly
            Player.setState(PlayerStatus.Active);
            setDisabled(false);
        });

        // Resets the state back to the original state
        Player.addListener(Player.NextQuestionEvent, () => {
            Player.setState(PlayerStatus.Active);
            setDisabled(true);
        });
    }, []);

    function buzz() {
        Player.tryBuzz();
    }
    
    return (
        <main className="main-flex">
            <ScoreCard username={username} points={points}/>

            <div className={buzzerStyles.buzzerBackgroundOuter}>
                <div className={buzzerStyles.buzzerBackgroundInner}>
                    <button onClick={buzz} className={buzzerStyles.buzzer} disabled={disabled}></button>
                </div>
            </div>
        </main>
    )
}