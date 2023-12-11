'use client'

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import { appConfig } from './../config'

import { UserSocketState } from '@/util/userSocket';

import { useConnection, useConnectionUpdate } from '@/context/GameContext';

import CenterForm from '@/components/center-form';
import BackButton from '@/components/back-button';
import Loader from '@/components/loader';
import { PlayerJoinStatus } from '@/util/playerManager';
import { AppError } from '@/components/AppNotification/AppNotification';


export default function PlayerSignup() {
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const userConnection = useConnection();
    const updateConnection = useConnectionUpdate();

    // Clear any existing connection (if applicable)
    useEffect(() => {
        updateConnection.clearConnection();
    }, []);


    useEffect(() => {
        if (userConnection.socketState === UserSocketState.OPEN) {
            router.push("/join/select-username");
        }

        if (userConnection.socketState === UserSocketState.ERROR) {
            displayError(PlayerJoinStatus.unknown);
        }
    })


    function displayError(code: PlayerJoinStatus) {
        setErrorMessage(getErrorMessage(code));
        setShowError(true);
        setInputError(true);
        setIsLoading(false);
    }


    function getErrorMessage(code: PlayerJoinStatus): string {
        if (code === PlayerJoinStatus.room_does_not_exist) {
            return "Unable to find a matching room."
        } else if (code === PlayerJoinStatus.room_closed) {
            return "Unable to join at the room at this time. Please try another room code."
        } else {
            return "Unable to join at this time. Please try again later."
        }
    }


    // Update the input box as soon as the user makes a change
    function handleInput (event: FormEvent) {
        if (inputError) {
            setInputError(false);
        }
    }


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const roomCode = form.room_code.value as string;

        connect(roomCode);
        
        setShowError(false);
        setIsLoading(true);
    }


    async function connect(room_code: string) {
        let url = appConfig.serverBaseUrl + "/buzzer/join-room";

        const data = {
            roomCode: room_code,
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (response.status !== 200) {
                displayError(PlayerJoinStatus.unknown);
                return;
            }

            const result = await response.json();

            if (result.success) {
                let game_id = result.room_code;
                let user_id = result.player.id;

                updateConnection.connectPlayer(game_id, user_id);

            } else {
                if (result.reason === 0) {
                    displayError(PlayerJoinStatus.room_does_not_exist)
                } else if (result.reason === 1) {
                    displayError(PlayerJoinStatus.room_closed)
                } else {
                    displayError(PlayerJoinStatus.unknown);
                }
            }


        } catch (error) {
            displayError(PlayerJoinStatus.unknown);
        }
    }


    return (
        <>
        
        <main>
        <BackButton url="."/>
            <CenterForm>
                <form onSubmit={handleSubmit} className="">
                    <input
                        className={"submit-text-box " + (inputError ? "submit-text-box-error" : "")}
                        type="text"
                        id="room_code" 
                        name="room_code"
                        placeholder='Room Code'
                        autoComplete='off'
                        onInput={handleInput}
                    />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </CenterForm>
            {
                isLoading ? <Loader /> : null
            }

            {
                showError ? <AppError
                                message={errorMessage} 
                                callback={() => {setShowError(false)}} 
                                notificationDuration={2000}
                                transitionDuration={500}
                            /> 
                            : null
            }
        </main>
        </>
    );
}