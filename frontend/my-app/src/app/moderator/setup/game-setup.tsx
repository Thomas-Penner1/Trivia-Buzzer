'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from 'react';

import BackButton from '@/components/back-button';
import Header from '@/components/header';

import { Player } from '@/data-structures/player';

import hostStyles from '../../../styles/host.module.css';

// A component allow a user to join a game, or return to the
// selection screen
export default function GameSetup() {
    let router = useRouter();
    

    // A temporary initialization function
    // Uses a number of players to create the initialization so that we have
    // something to display on the screen.
    function init() {
        const nPlayers = 20;
        let players = [] as Player[];

        for (let i = 0; i < nPlayers; ++i) {
            let player = {
                id: String(i),
                username: "player " + i,
                points: 0,
            } as Player;

            players.push(player);
        }

        return players;
    }

    const [participants, setParticipants] = useState(init() as Player[]);


    // setParticipants(players);

    let continuePolling = true as boolean;

    // Allows the user to stop the polling method - idk, but seems
    // really useful tbh
    function togglePolling() {
        continuePolling = !continuePolling;

        if (continuePolling) {
            awaitParticipants();
        }
    }

    // A method that is used to accept new users. We want? to be
    // able to limit the number of participants if possible
    async function awaitParticipants() {
        // let response = await fetch(
        //     "http://localhost:3000/buzzer/ID/username/subscribe",
        //     { cache: 'no-store'}
        // );

        // if (!continuePolling) {
        //     return;
        // }

        // if (response.status === 502) {
        //     // Connection timeout
        //     await awaitParticipants();

        // } else if (response.status != 200) {
        //     // Error happened
        //     // TODO: add proper error handling here
        //     await awaitParticipants();

        // } else {
        //     // Got a participant!!
        //     let participant = await response.text();
        //     let nextState = [...participants, participant];
        //     setParticipants(nextState);

        //     await awaitParticipants();
        // }
    }

    // NOTE: Currently handling it here for simplicity
    // TODO: https://stackoverflow.com/questions/29810914/react-js-onclick-cant-pass-value-to-method
    function removePlayer(playerId: string) {
        let updatedParticipants = participants.filter(item => item.id != playerId);
        setParticipants(updatedParticipants); 
    }

    // We will need to set-up a system to notify the other participants of the required
    // start state
    function startGame() {
        router.push("http://localhost:3000/moderator/game")
    }

    // awaitParticipants();

    return (
        <>
        <div className="page-wrapper">
            <main className='main-flex'>
            
                
                <div className="header-wrapper">
                    <Header />
                </div>

                <div className={hostStyles.gameBoardWrapper}>
                    <div className={hostStyles.gameBoard}>
                        <h2 className={hostStyles.gameBoardTitle}>
                            Players Joined
                        </h2>

                        <div className={hostStyles.playerHolderWrapper}>
                            <ul className={hostStyles.playerHolder}>
                                {participants.map(
                                    participant => (<li key={participant.id}>
                                        <div className={hostStyles.player} onClick={() => removePlayer(participant.id)}>
                                            {participant.username}
                                        </div>
                                    </li>)
                                )}
                            </ul>
                        </div>


                        <div className={hostStyles.gameBoardFooter}>
                            <button className={hostStyles.actionButton} onClick={startGame}>
                                <p className={hostStyles.actionButtonText}>
                                    Start
                                </p>
                                <img className={hostStyles.actionButtonIcon} src="/play-button-arrow.svg" alt="Play Arrow" />
                            </button>
                            <button className={hostStyles.actionButton} onClick={togglePolling}>
                                <p className={hostStyles.actionButtonText}>
                                    Lock
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