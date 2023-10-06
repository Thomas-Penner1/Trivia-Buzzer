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
import Loader from '@/components/loader';

import GameManager, { GameManagerEvents } from '@/util/gameManager';
import gameManager from '@/util/gameManager';
import { GameState } from '@/util/enums/GameState';

const MIN_WAIT = 333;

export default function GameSetup() {
    let router = useRouter();

    const [game, setGame] = useState(GameManager.getGame());
    const [isLoading, setIsLoading] = useState(true);

    // A simple function for when we add
    function updateGame() {
        setGame(GameManager.getGame());
    }

    useEffect(() => {
        GameManager.addListener(GameManagerEvents.update, updateGame);
    }, []);

    useEffect(() => {
        setTimeout(() => {setIsLoading(false)}, MIN_WAIT)
    }, []);

    useEffect(() => {
        if (game.getStatus() === GameState.Active) {
            router.push('./game');
        }
    });

    GameManager.initialize();
    // console.log(GameManager);

    // Get the game from the state manager
    // let Game = StateManager.getGame();

    // const [gameCode, setGameCode] = useState("");
    // const [participants, setParticipants] = useState([] as Player[]);

    console.log(game);



    // Only run after the FIRST time this object has been loaded
    // useEffect(() => {
    //     Game.addListener(Game.GameCodeEvent, () => {
    //         if (Game.gameCode !== undefined) {
    //             setGameCode(Game.gameCode);
    //             setIsLoading(false);
    //         }
    //     })
    
    //     Game.addListener(Game.PlayerEvent, () => {
    //         setParticipants([...Game.players]);
    //     })

    //     initialize();
    // }, []);

    // async function initialize() {
    //     let url = appConfig.serverBaseUrl + "/buzzer/create-game";
    //     const response = await fetch(url, {
    //         method: "POST",
    //     });

    //     // When we are unable to initialize this component, we return to
    //     // homepage
    //     if (response.status != 200) {
    //         router.push('.');
    //     }
        
    //     const result = await response.json();

    //     StateManager.initialize(result.room_id, result.user_id, true);
    //     StateManager.connect();
    // }

    function togglePolling() {
        if (game.getIsOpen()) {
            gameManager.sendCloseRoom();
        } else {
            gameManager.sendOpenRoom();
        }
    }

    function removePlayer(user_id: string) {
        GameManager.sendRemovePlayer(user_id);
    }

    function startGame() {
        GameManager.sendStartGame();
    }

    if (isLoading || !game.getGameCode()) {
        return <Loader />
    }

    let n_pending = game.getPlayers().filter(player => player.status === PlayerStatus.Pending).length;
    let n_waiting = game.getPlayers().filter(player => player.status === PlayerStatus.Ready).length;
    let n_total = game.getPlayers().length;

    return (
        <main>
            <div className={hostStyles.hostMainWrapper}>
                <div className={hostStyles.hostMain}>
                    <div className={hostStyles.hostMainInner}>
                        <div className={hostStyles.headerWrapper}>
                            <Header />
                        </div>

                        <div className={hostStyles.gameBoardWrapper}>
                            <GameBoard 
                                players={game.getPlayers()} 
                                setUp={true} 
                                removePlayer={(id: string) => {removePlayer(id)}}
                            />
                        </div>

                        <div className={hostStyles.gameFooter}>
                            <div className={hostStyles.gameCodeWrapper}>
                                <div className={hostStyles.gameCode}>
                                    Room Code: { game.getGameCode() }
                                </div>

                                <button className={hostStyles.actionButton} onClick={togglePolling}>
                                    {game.getIsOpen() ? "Lock" : "Unlock"}
                                </button>
                            </div>

                            <div className={hostStyles.playerInfo}>
                                <div className={hostStyles.playerInfoBlock}>
                                    Pending: {n_pending}
                                </div>
                                <div className={hostStyles.playerInfoBlock}>
                                    Waiting: {n_waiting}
                                </div>
                                <div className={hostStyles.playerInfoBlock}>
                                    Total: {n_total}
                                </div>
                            </div>

                            <div className={hostStyles.continueButtonWrapper}>
                                <button className={hostStyles.continueButton} onClick={startGame}>
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}