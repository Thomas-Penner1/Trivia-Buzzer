'use client'

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from 'react';

import { appConfig } from './../config'

import { useConnection, useConnectionUpdate } from '@/context/GameContext';

import Loader from '@/components/loader';
import { HorizontalCenteredDiv, VerticalCenteredDiv } from "@/components/CenteredDiv";
import { useUpdateAppNotificationContext } from "@/context/AppNotificationContext";
import Link from "next/link";
import { UserSocketState } from "@/util/userSocket";


export default function PlayerSignup() {
    const addAppNotification = useUpdateAppNotificationContext();

    const [isLoading, setIsLoading] = useState(false);
    const [inputError, setInputError] = useState(false);

    const router = useRouter();

    const userConnection = useConnection();
    const updateConnection = useConnectionUpdate();


    useEffect(() => {
        if (userConnection.socketState === UserSocketState.OPEN) {
            router.push("/join/select-username");
        }

        if (userConnection.socketState === UserSocketState.ERROR) {
            displayError(-1);
        }
    })


    function displayError(code: number) {
        addAppNotification.displayError(getErrorMessage(code));
        setInputError(true);
        setIsLoading(false);

        addAppNotification.displayError("An error occured");
    }


    function getErrorMessage(code: number): string {
        if (code === 0) {
            return "Unable to find a matching room."
        } else if (code === 1) {
            return "Unable to join at the room at this time. Please try another room code."
        } else {
            return "Unable to join at this time. Please try again later."
        }
    }


    // // Update the input box as soon as the user makes a change
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

        addAppNotification.removeAppNotification();
        setIsLoading(true);
    }


    async function connect(room_code: string) {
        let url = appConfig.serverBaseUrl + "/buzzer/join-room";

        const data = {
            roomCode: room_code,
        }

        let response;

        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

        } catch (error) {
            displayError(-1);
            return;
        }

        if (response.status !== 200) {
            displayError(-1);
            return;
        }

        const result = await response.json();

        if (result.success) {
            let game_id = result.room_code;
            let user_id = result.player_id;

            updateConnection.connectPlayer(game_id, user_id);

        } else {
            displayError(result.reason);
        }
    }


    return (
        <>
            <VerticalCenteredDiv>
                <HorizontalCenteredDiv>
                    <div className="middle-menu-background">
                        <div>
                            <h1>Join Game</h1>
                        </div>
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
                            <button type="submit">Join</button>
                        </form>
                        <Link href=".">Home</Link>
                    </div>
                </HorizontalCenteredDiv>
            </VerticalCenteredDiv>

            {
                isLoading ? <Loader /> : null
            }
        </>
    );
}