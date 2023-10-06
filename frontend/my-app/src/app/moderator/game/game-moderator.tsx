'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import BackButton from '@/components/back-button';
import Header from '@/components/header';

import { Player } from '@/data-structures/player';

import hostStyles from '../../../styles/host.module.css';
import { StateManager } from '@/util/stateManager';
import GameBoard from '@/components/game-board';
import { PlayerStatus } from '@/util/enums/PlayerStatus';

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
                    <button className={hostStyles.correctButton} onClick={() => onCorrect(user_id)}>
                        Correct
                    </button>

                    <button className={hostStyles.incorrectButton} onClick={() => onIncorrect(user_id)}>
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

    let Game = StateManager.getGame();

    // Get variables for this page
    let _locked = !Game.isOpen;
    let _participants = [...Game.players];
    let gameCode = Game.gameCode;

    const [participants, setParticipants] = useState(_participants);
    const [locked, setLocked] = useState(_locked);

    const [buzz, setBuzz] = useState(false);
    const [buzzPlayer, setBuzzPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        Game.addListener(Game.PlayerEvent, () => {
            setParticipants([...Game.players]);
        })

        Game.addListener(Game.BuzzEvent, (user_id: string) => {
            let player = participants.find((player) => player.id == user_id);

            if (player !== undefined) {
                setBuzz(true);
                setBuzzPlayer(player);
            }
        });

    }, []);

    function togglePolling() {
        Game.togglePolling();

        setLocked( !locked );
    }

    function nextQuestion() {

    }

    // On a correct answer, we need to:
    // 1. Increment the player's points by 1
    function correctAnswer(user_id: string) {
        let player = participants.find((player) => player.id == user_id);

        if (player === undefined) {
            setBuzz(false);
            return;
        }

        player.points = player.points + 1;

        setParticipants([...Game.players])
        setBuzz(false);
    }

    // On an incorrect answer, we need to:
    // 1. Change the player's status
    // 2. Notify to the server that we have an incorrect answer
    function incorrectAnswer(user_id: string) {
        let player = participants.find((player) => player.id == user_id);

        if (player === undefined) {
            setBuzz(false);
            return;
        }

        player.status = PlayerStatus.Incorrect;
        
        setParticipants([...Game.players]);
        setBuzz(false);
    }

    return (
        <main>
            <div className={hostStyles.hostMainWrapper}>
                <div className={hostStyles.hostMain}>
                    <div className={hostStyles.hostMainInner}>
                        <div className={hostStyles.headerWraper}>
                            <Header />
                        </div>

                        <div className={hostStyles.gameBoardWrapper}>
                            <GameBoard
                                players={participants}
                                setUp={false}
                                removePlayer={(id: string | number) => Game.removePlayer(id)}
                            />
                        </div>

                        <div className={hostStyles.gameFooter}>
                            <div className={hostStyles.gameCodeWrapper}>
                                <div className={hostStyles.gameCode}>
                                    Room Code: {gameCode}
                                </div>

                                <button className={hostStyles.actionButton} onClick={togglePolling}>
                                    {locked ? "Unlock" : "Lock"}
                                </button>
                            </div>

                            <button className={hostStyles.actionButton} onClick={nextQuestion}>
                                Next Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            { buzz ? <BuzzDisplay 
                player={buzzPlayer}
                onCorrect={correctAnswer}
                onIncorrect={incorrectAnswer}
            /> : null }
        </main>
    );
}