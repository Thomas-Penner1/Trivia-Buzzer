'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useEffect } from 'react';

import BackButton from '@/components/back-button';
import CenterForm from '@/components/center-form';
import { StateManager } from '@/util/stateManager';

// A component allow a user to join a game, or return to the
// selection screen
export default function UsernameSelection() {
    const router = useRouter();
    let username: string;
    let Player = StateManager.getPlayer();

    Player.addListener(Player.SuccessUsernameEvent, () => {
        router.push("/play/ready");
    })

    Player.addListener(Player.FailUsernameEvent, () => {
        // TODO: display an error message
    })

    // Handle the submit event on the form submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        username = form.username.value;

        Player.trySetUsername(username);

        // let data = {
        //     username: form.username.value
        // };

        // StateManager.setUsername(username);
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
            
        </main>
    );
}