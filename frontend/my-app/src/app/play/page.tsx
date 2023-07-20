'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ScoreCard from "@/components/score-card";

import buzzerStyles from "../../styles/buzzer.module.css"

export default function Play() {
    const router = useRouter();

    const [points, setPoints] = useState( 0 );
    const [disabled, setDisabled] = useState( false );

    // Get vars from session storage
    let username = sessionStorage.getItem("username") as string;
    // username = "hello";

    // Ensure that this user SHOULD be here, and redirect them to the home
    // page otherwise
    //
    // TODO: make this transition look nicer :)
    useEffect(() => {
        if (!username) {
            router.push(".");
        }
    });

    function handleClick() {
        // Get the time
        console.log(Date.now());
        setDisabled(true);
        
        // setPoints(points + 1);
    }
    
    return (
        <main className="main-flex">
            <ScoreCard username={username} points={points}/>

            <div className={buzzerStyles.buzzerBackgroundOuter}>
                <div className={buzzerStyles.buzzerBackgroundInner}>
                    <button onClick={handleClick} className={buzzerStyles.buzzer} disabled={disabled}></button>
                </div>
            </div>
        </main>
    )
}