'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ScoreCard from "@/components/score-card";

import buzzerStyles from "../../styles/buzzer.module.css"
import { StateManager } from "@/util/stateManager";
import { PlayerStatus } from "@/util/enums/PlayerStatus";


interface BuzzerIndicatorProps {
    lit: boolean,
}


function BuzzerIndicator({lit}: BuzzerIndicatorProps) {
    let litClass: string;

    if (lit) {
        litClass = buzzerStyles.buzzerIndicatorOn;
    } else {
        litClass = buzzerStyles.buzzerIndicatorOff;
    }

    return (
        <div className={litClass}></div>
    )
}


export default function Play() {
    const router = useRouter();

    const [buzz, setBuzz] = useState(false);
    const [disabled, setDisabled] = useState( false );

    let Player = StateManager.getPlayer();

    let username = Player.username as string;
    let points = Player.points;

    useEffect(() => {
        // Remove all listeners currently set up
        Player.removeAllListeners();

        Player.addListener(Player.SuccessBuzzEvent, () => {
            setBuzz(true);
        });

        // Not sure whether or not we need to do anything here
        Player.addListener(Player.FailBuzzEvent, () => {
        });

        Player.addListener(Player.CorrectAnswerEvent, () => {
        });

        Player.addListener(Player.IncorrectAnswerEvent, () => {
        });

        Player.addListener(Player.NextQuestionEvent, () => {
        });

    }, []);

    function Buzz() {
        Player.tryBuzz();
    }
    
    return (
        <main className="main-flex">
            <ScoreCard username={username} points={points}/>

            <div className={buzzerStyles.buzzerBackgroundOuter}>
                <div className={buzzerStyles.buzzerBackgroundInner}>
                    <BuzzerIndicator lit={buzz} />
                    <button onClick={Buzz} className={buzzerStyles.buzzer}></button>
                </div>
            </div>
        </main>
    )
}