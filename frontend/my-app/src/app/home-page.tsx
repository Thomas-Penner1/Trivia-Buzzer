'use client'

import { useRouter, useSearchParams } from "next/navigation";
import CenterForm from "../components/center-form";

import { AppNotification } from "@/components/Notification";
import { useEffect, useState } from "react";
import { UserSocketCloseReason } from "@/util/userSocket";

import styles from '../styles/home-page.module.css';
import { useConnectionUpdate } from "@/context/GameContext";


function HelpDisplay() {
    return (
        <div className={styles.helpWrapper}>
            asdf
        </div>
    )
}


export default function HomePage() {
    const updateConnection = useConnectionUpdate();

    useEffect(() => {
        updateConnection.clearConnection();
    }, [])


    const [displayHelp, setDisplayHelp] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    function playerSelection() {
        router.push('/join');
    }

    async function moderatorSelection() {
        router.push('/create-game');
    }

    let displayMessage = false;
    let message: string = "";

    if (searchParams.get("close_reason")) {
        let reason = Number(searchParams.get("close_reason"));

        switch (reason) {
            case UserSocketCloseReason.UNKOWN_REASON:
                displayMessage = true;
                message = "Connection lost due to unknown reason.";
                break;

            case UserSocketCloseReason.SERVER_ENDED_GAME:
                displayMessage = true;
                message = "Server closed the game.";
                break;

            case UserSocketCloseReason.HOST_REMOVED_USER:
                displayMessage = true;
                message = "Removed by game by host.";
                break;

            case UserSocketCloseReason.HOST_LEFT_GAME:
                displayMessage = true;
                message = "Host ended the game.";
                break;

            case UserSocketCloseReason.HOST_ENDED_GAME:
                displayMessage = true;
                message = "Host ended the game.";
                break;
        
            default:
                break;
        }
    }

    const [showMessage, setShowMessage] = useState(displayMessage);

    function removeNotification() {
        setShowMessage(false);
    }

    return (
        <main>
            <div className="main-flex">
                <div className="center-form-wrapper">
                    <CenterForm header={true}>
                        <h2>Role Select</h2>
                        <div className="role-button-row">
                            <button onClick={playerSelection} className="select-button player-button">
                                Player
                            </button>
                            <button onClick={moderatorSelection} className="select-button moderator-button">
                                Host
                            </button>
                        </div>
                    </CenterForm>
                </div>

                <div>
                    <p>Created by: Thomas Penner</p>
                </div>
            </div>

            {
                displayHelp ? <HelpDisplay /> : null
            }

            {
                showMessage ? 
                    <AppNotification 
                        message={message}
                        transitionDuration={500}
                        callback={removeNotification}
                    /> 
                    : null
            }
        </main>
      );
}