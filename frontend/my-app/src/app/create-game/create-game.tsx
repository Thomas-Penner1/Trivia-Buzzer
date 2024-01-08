'use client'

import { useConnection, useConnectionUpdate } from "@/context/GameContext";
import { FormEvent, useEffect, useState } from "react";
import { appConfig } from "../config";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { UserSocketState } from "@/util/userSocket";
import { HorizontalCenteredDiv, VerticalCenteredDiv } from "@/components/CenteredDiv";
import { useUpdateAppNotificationContext } from "@/context/AppNotificationContext";

function getErrorMessage() {
    return "Unable to create a game right now. Try again later.";
}

export default function CreateGame() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const errorMessage = getErrorMessage();

    const updateConnection = useConnectionUpdate();
    const userConnection = useConnection();

    const addAppNotification = useUpdateAppNotificationContext();

    useEffect(() => {
        if (userConnection.socketState === UserSocketState.OPEN) {
            router.push('./moderator/setup');
        }

        if (userConnection.socketState === UserSocketState.ERROR) {
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

        createGame(roomName);

        setIsLoading(true);
    }


    async function createGame(roomName: string) {
        let url = appConfig.serverBaseUrl + "/buzzer/create-game";

        let response;

        try {
            if (roomName) {
                const data = {
                    roomName: roomName,
                }

                console.log(roomName);

                response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                });

            } else {
                response = await fetch(url, {
                    method: "POST",
                });
            }

        } catch (error) {
            setIsLoading(false);
            addAppNotification.displayError(errorMessage);
            return;
        }

        if (response.status !== 200) {
            setIsLoading(false);
            addAppNotification.displayError(errorMessage);
        }

        const result = await response.json();

        let game_id = result.room_id;
        let user_id = result.user_id;

        updateConnection.connectHost(game_id, user_id);
    }

    return (
        <>
            <VerticalCenteredDiv>
                <HorizontalCenteredDiv>
                    <div className="middle-menu-background">
                        <div>
                            <h1>
                                Create Game
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <input
                                    className={"submit-text-box"}
                                    type="text"
                                    id="room_name"
                                    name="room_name"
                                    placeholder="Game Name (optional)"
                                    autoComplete="off"
                                />

                                <button type="submit">Create</button>
                            </form>
                        </div>
                    </div>
                </HorizontalCenteredDiv>
            </VerticalCenteredDiv>

            {
                isLoading ? <Loader /> : null
            }
        </>
    );
}