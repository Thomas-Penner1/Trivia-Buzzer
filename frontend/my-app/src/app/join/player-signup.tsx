'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from 'react';

import CenterForm from '@/components/center-form';
import BackButton from '@/components/back-button';

// A component allow a user to join a game, or return to the
// selection screen
export default function PlayerSignup() {
    const [isError, setIsError] = useState(false);
    const [slideUp, setSlideUp] = useState(true);
    const [inputError, setInputError] = useState(false);

    const router = useRouter();

    // A method to show the error for a portion of time. Note that
    // TODO: figure out an appropriate amount of time to display the message for
    async function showError () {
        let promise = new Promise(r => setTimeout(r, 5000));
        setIsError(true);
        await promise;
        setSlideUp(false);
        await new Promise(r => setTimeout(r, 1000));
        setIsError(false);
        setSlideUp(true);
    }

    // NOTE: we empty the form when a user enters an invalid response. Otherwise,
    // we want to only have the error displayed when they have not entered anything
    // Note that we only need to check if isError is true, and once we have received
    // input we can set isError back to false
    function handleInput (event: FormEvent) {
        if (inputError) {
            setInputError(false);
        }

        console.log(inputError);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        console.log(form);

        const data = {
            roomCode: form.room_code.value as string,
        }

        // NOTE: temporary removal of validation

        // const response = await fetch("http://localhost:3000/buzzer", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        // })

        // const result = await response.json();

        // let isValid = result.success as boolean;

        // if (isValid) {
        //     // Transition the user to the next value that we are going to
        //     // experience
        //     router.push('/join/select-username')
        // } else {
        //     // The code that the user entered is not valid, so we need
        //     // to ensure that the user remains on this page
        //     form.room_code.value = '';
        // }

        // dummy values to test the scripting without 
        if ( data.roomCode === "hello" ) {
            sessionStorage.setItem("myCat", "x");
            router.push('/join/select-username');
        } else {
            showError();
            setInputError(true);
            return false;
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
                isError ? (
                    <div className={
                        slideUp ? "error-bar slide-up" : "error-bar slide-down"
                    }>
                        <img src="important.svg" className="error-image"/>
                        <p>We could not find the matching game. Please try again.</p>
                        <img src="important.svg" className="error-image"/>
                    </div>
                ) : (
                    <></>
                )
            }

        </main>
        </>
    );
}