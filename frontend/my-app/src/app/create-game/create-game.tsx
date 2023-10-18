'use client'

import CenterForm from "@/components/center-form";
import { useConnection, useConnectionUpdate } from "@/context/GameContext";
import { FormEvent, useEffect, useState } from "react";
import { appConfig } from "../config";
import { AppError } from "@/components/Notification";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { UserSocketState } from "@/util/userSocket";

function getErrorMessage() {
    return "Unable to create a game right now. Try again later.";
}

export default function CreateGame() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const errorMessage = getErrorMessage();

    const updateConnection = useConnectionUpdate();
    const userConnection = useConnection();

    useEffect(() => {
        if (userConnection.socketState === UserSocketState.OPEN) {
            router.push('./moderator/setup');
        }

        if (userConnection.socketState === UserSocketState.ERROR) {
            setShowError(true);
            setIsLoading(false);
        }
    })

    useEffect(() => {
        updateConnection.clearConnection();
    }, []);


    // TODO: add persistence to the game name
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const roomName = form.room_name.value as string;

        createGame();

        setIsLoading(true);
    }


    async function createGame() {
        let url = appConfig.serverBaseUrl + "/buzzer/create-game";

        try {
            const response = await fetch(url, {
                method: "POST",
            });

            if (response.status !== 200) {
                setShowError(true);
                setIsLoading(false);
                return;
            }

            const result = await response.json();

            let game_id = result.room_id;
            let user_id = result.user_id;

            console.log(game_id);
            console.log(user_id);

            updateConnection.connectHost(game_id, user_id);

            // updateGame.connectHost(game_id, user_id);

            // console.log(userState);

        } catch (error) {
            setShowError(true);
            setIsLoading(false);
        }
    }

    return (
        <main>
            <CenterForm>
                <form onSubmit={handleSubmit}>
                    <input
                        className={"submit-text-box"}
                        type="text"
                        id="room_name" 
                        name="room_name"
                        placeholder='Game Name (optional)'
                        autoComplete='off'
                    />

                    <button type="submit" className="submit-button">Create Game</button>
                </form>
            </CenterForm>

            {
                showError ? <AppError 
                    message={errorMessage}  
                    transitionDuration={500} 
                    notificationDuration={2000}
                    callback={() => {setShowError(false)}}
                    /> 
                    : null
            }

            {
                isLoading ? <Loader /> : null
            }
        </main>
    );
}