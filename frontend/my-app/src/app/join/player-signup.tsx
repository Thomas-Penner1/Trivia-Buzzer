'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import { appConfig } from './../config'

import CenterForm from '@/components/center-form';
import BackButton from '@/components/back-button';
import { StateManager } from '@/util/stateManager';
import Loader from '@/components/loader';
// import AppNotification from '@/components/notification';
import PlayerManager, { PlayerEvent, PlayerJoinStatus } from '@/util/playerManager';
import { AppError, AppNotification } from '@/components/Notification';
// import AppNotification from '@/components/notification_';

// A component allow a user to join a game, or return to the
// selection screen
export default function PlayerSignup() {
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    // NOTE: Using useEffect to guarantee that this code is only run the first
    // time that the component runs
    useEffect(() => {
        PlayerManager.reset();
    }, []);

    // NOTE: Wrapping the use of the router in use effect, so that we are guaranteed
    // to only have one method, we can clean it up, and it will run after the
    // component has been rendered
    useEffect(() => {
        PlayerManager.addListener(PlayerEvent.update, () => {
            router.push('/join/select-username');
        });

        return () => {
            console.log("unloading");
            PlayerManager.removeAllListeners(PlayerEvent.update);
        }
    })

    // input we can set isError back to false
    function handleInput (event: FormEvent) {
        if (inputError) {
            setInputError(false);
        }
    }

    async function connect(room_code: string) {
        let result = await PlayerManager.initialize(room_code);

        console.log(result);
        
        if (result === PlayerJoinStatus.success) {
            return;
        }

        setErrorMessage(getErrorMessage(result));
        setShowError(true);
        setInputError(true);
        setIsLoading(false);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const roomCode = form.room_code.value as string;

        connect(roomCode);
        setShowError(false);
        setIsLoading(true);
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