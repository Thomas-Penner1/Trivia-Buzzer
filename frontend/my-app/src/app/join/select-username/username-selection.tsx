'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import BackButton from '@/components/back-button';
import CenterForm from '@/components/center-form';
import { StateManager } from '@/util/stateManager';
import Loader from '@/components/loader';
import AppNotification from '@/components/notification';
import PlayerManager, { PlayerEvent } from '@/util/playerManager';

// A component allow a user to join a game, or return to the
// selection screen
export default function UsernameSelection() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const errorMessage_duplicate = "Username already exists. Please select something else."
    const errorMessage_empty = "Username must contain a non-whitespace character";

    let username: string;

    // console.log(PlayerManager.getUsernames());
    function checkUsername() {
        console.log("here");
        if (PlayerManager.getPlayer().username) {
            router.push("/play/ready");
        } else {
            setIsLoading(false);
            setShowError(true);
            setErrorMessage(errorMessage_duplicate);

            // Recurse so that we never have to call this more than needed
            PlayerManager.once(PlayerEvent.update, checkUsername);
        }
    }

    useEffect(() => {
        // PlayerManager.removeAllListeners(PlayerEvent.update);

        PlayerManager.once(PlayerEvent.update, checkUsername);
    }, []);

    // Handle the submit event on the form submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        username = form.username.value as string;
        username = username.trim();
        console.log(username);

        if (username === "") {
            setErrorMessage(errorMessage_empty);
            setShowError(true);
            return;
        }

        PlayerManager.sendSetUsername(username);

        setIsLoading(true);
    }

    return (
        <main>
            <BackButton url="."/>

            <CenterForm>
                <form onSubmit={handleSubmit}>
                    <input 
                        className="submit-text-box"
                        type="text" 
                        id="username" 
                        name="username"
                        placeholder='Username'
                        autoComplete='off'
                        required 
                    />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </CenterForm>
            
            {isLoading ? <Loader /> : null}

            {
                showError ? <AppNotification 
                        message={errorMessage} 
                        removeFunction={() => {setShowError(false)}} 
                        inProp={showError} 
                        activeTime={2000}
                    /> 
                    : null
            }
        </main>
    );
}