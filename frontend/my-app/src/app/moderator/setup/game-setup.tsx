'use client'

import { useRouter } from "next/navigation";
import { useEffect } from 'react';

import Header from '@/components/header';

import hostStyles from '../../../styles/host.module.css';
import { PlayerStatus } from '@/util/enums/PlayerStatus';
import GameBoard from '@/components/game-board';

import { GameState } from '@/util/enums/GameState';
import { useGame, useGameUpdate } from '@/context/GameContext';

const MIN_WAIT = 333;

export default function GameSetup() {
    let router = useRouter();

    const game = useGame();
    const updateGame = useGameUpdate();

    console.log(game);

    useEffect(() => {
        if (game.getStatus() === GameState.Active) {
            router.push('./game');
        }
    });

    function togglePolling() {
        if (game.getIsOpen()) {
            updateGame.sendCloseRoom();
        } else {
            updateGame.sendOpenRoom();
        }
    }

    function removePlayer(user_id: string) {
        updateGame.sendRemovePlayer(user_id);
    }

    function startGame() {
        updateGame.sendStartGame();
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