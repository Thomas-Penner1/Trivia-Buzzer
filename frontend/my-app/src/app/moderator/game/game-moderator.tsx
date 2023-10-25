'use client'

import { useRouter } from "next/navigation";
import Header from '@/components/header';

import { Player } from '@/data-structures/player';

import hostStyles from '../../../styles/host.module.css';
// import { StateManager } from '@/util/stateManager';
import GameBoard from '@/components/game-board';
import { PlayerStatus } from '@/util/enums/PlayerStatus';
import { useGame, useGameUpdate } from '@/context/GameContext';

interface BuzzDisplayProps {
    player?: Player,
    onCorrect: Function,
    onIncorrect: Function,
}

function BuzzDisplay({player, onCorrect, onIncorrect}: BuzzDisplayProps) {
    if (player === undefined) {
        return null;
    }

    let username = player.username;
    let user_id = player.id;

    return (
        <div className={hostStyles.buzzerOuter}>
            <div className={hostStyles.buzzerInner}>
                {username} has buzzed in

                <div className={hostStyles.buzzerOptions}>
                    <button className={hostStyles.correctButton} onClick={() => onCorrect()}>
                        Correct
                    </button>

                    <button className={hostStyles.incorrectButton} onClick={() => onIncorrect()}>
                        Incorrect
                    </button>
                </div>
            </div>
        </div>
    )
}


// A component allow a user to join a game, or return to the
// selection screen
export default function GameModerator() {
    let router = useRouter();
    
    const game = useGame();
    console.log(game);
    const updateGame = useGameUpdate();

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

    let active_player = game.getPlayers().find((player) => player.status === PlayerStatus.Buzz);
    // console.log(active_player);

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
                                setUp={false} 
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
                                <button className={hostStyles.continueButton} onClick={() => {updateGame.sendNextQuestion()}}>
                                    Next Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                active_player !== undefined ? <BuzzDisplay
                    player={active_player}
                    onCorrect={() => {updateGame.sendCorrectAnswer()}}
                    onIncorrect={() => {updateGame.sendIncorrectAnswer()}}
                /> 
                : null
            }
        </main>
    );
}