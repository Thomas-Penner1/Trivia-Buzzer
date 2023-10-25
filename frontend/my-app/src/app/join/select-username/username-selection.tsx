'use client'

import { useRouter } from "next/navigation";
import { FormEvent, useState } from 'react';

import BackButton from '@/components/back-button';
import CenterForm from '@/components/center-form';
import Loader from '@/components/loader';
import { AppError } from '@/components/Notification';
import { usePlayer, usePlayerUpdate } from "@/context/GameContext";


const ERROR_MESSAGE_DUPLICATE = "Username already exists. Please select something else.";
const ERROR_MESSAGE_EMTPY     = "Username must contain a non-whitespace character";


export default function UsernameSelection() {
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const playerState = usePlayer();
    const updatePlayer = usePlayerUpdate();
    const player = playerState.player;

    let username: string;

    // Handle the submit event on the form submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        username = form.username.value as string;
        username = username.trim();
        console.log(username);

        if (username === "") {
            setErrorMessage(ERROR_MESSAGE_EMTPY);
            setShowError(true);
            return;
        }

        function checkUsernameSuccess(data: any) {
            console.log(data);

            let success = data.result;

            if (success) {
                router.push("/play/ready");

            } else {
                setShowError(true);
                setErrorMessage(ERROR_MESSAGE_DUPLICATE);
                setIsLoading(false);
            }
        }

        updatePlayer.sendSetUsername(username, checkUsernameSuccess);

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
                showError ? <AppError
                        message={errorMessage} 
                        callback={() => {setShowError(false)}} 
                        notificationDuration={2000}
                        transitionDuration={500}
                    /> 
                    : null
            }
        </main>
    );
}