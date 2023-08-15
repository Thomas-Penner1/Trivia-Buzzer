'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import { StateManager } from '@/util/stateManager';
import { appConfig } from '@/app/config';

import BackButton from '@/components/back-button';
import Header from '@/components/header';

import { Player } from '@/data-structures/player';

import hostStyles from '../../../styles/host.module.css';
import PlayerDisplay from '@/components/player';
import { PlayerStatus } from '@/util/enums/PlayerStatus';
import GameBoard from '@/components/game-board';

// A component allow a user to join a game, or return to the
// selection screen
export default function GameSetup() {
    let tempPlayer = {
        id: "a",
        username: "hello",
        status: PlayerStatus.Ready,
        points: 0
    } as Player;

    let router = useRouter();

    // Get the game from the state manager
    let Game = StateManager.getGame();

    const [gameCode, setGameCode] = useState("");
    const [participants, setParticipants] = useState([] as Player[]);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        console.log("i ran");
        StateManager.connect();

        Game.addListener(Game.GameCodeEvent, () => {
            if (Game.gameCode !== undefined) {
                setGameCode(Game.gameCode);
            }
        })
    
        Game.addListener(Game.PlayerEvent, () => {
            setParticipants([...Game.players]);
        })
    }, []);

    function togglePolling() {
        Game.togglePolling();

        setLocked( !locked );
    }

    // We will need to set-up a system to notify the other participants of the required
    // start state
    function startGame() {
        Game.startGame();
        Game.removeAllListeners();

        router.push("./game");
    }

    return (
        <>
        <div className="page-wrapper">
            <main className='main-flex'>
            
                
                <div className="header-wrapper">
                    <Header />
                </div>

                <div className={hostStyles.gameBoardWrapper}>
                    <div className={hostStyles.gameBoard}>
                        <div className={hostStyles.gameCode}>
                            Game Code: 
                            { gameCode? gameCode : <div className={hostStyles.dotFlashing}></div>}
                            
                        </div>
                        <h2 className={hostStyles.gameBoardTitle}>
                            Players
                        </h2>

                        <GameBoard 
                            players={participants} 
                            setUp={true} 
                            removePlayer={(id: string | number) => Game.removePlayer(id)}
                        />


                        <div className={hostStyles.gameBoardFooter}>
                            <button className={hostStyles.actionButton} onClick={startGame}>
                                <p className={hostStyles.actionButtonText}>
                                    Start
                                </p>
                                <img className={hostStyles.actionButtonIcon} src="/play-button-arrow.svg" alt="Play Arrow" />
                            </button>
                            <button className={hostStyles.actionButton} onClick={togglePolling}>
                                <p className={hostStyles.actionButtonText}>
                                    {locked ? "unlock" : "lock"}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
}