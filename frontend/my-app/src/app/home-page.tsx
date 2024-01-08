'use client'

import { useRouter, useSearchParams } from "next/navigation";

import { useEffect } from "react";
import { UserSocketCloseReason } from "@/util/userSocket";

import styles from '../styles/home-page.module.css';
import { useUpdateAppNotificationContext } from "@/context/AppNotificationContext";
import { HorizontalCenteredDiv, VerticalCenteredDiv } from "@/components/CenteredDiv";



function GetCloseReason(close_code: Number) {
    switch (close_code) {
        case UserSocketCloseReason.UNKOWN_REASON:
            return "Connection lost due to unknown reason.";

        case UserSocketCloseReason.SERVER_ENDED_GAME:
            return "Server closed the game.";

        case UserSocketCloseReason.HOST_REMOVED_USER:
            return "Removed by game by host.";

        case UserSocketCloseReason.HOST_LEFT_GAME:
            return "Host ended the game.";

        case UserSocketCloseReason.HOST_ENDED_GAME:
            return "Host ended the game.";
    
        default:
            return "Connection lost due to unknown reason.";
    }
}


function HomeFooter() {
    return (
        <div className={styles.homeFooter}>
            <div className={styles.creator}>Created by: Thomas Penner</div>
            <a target="_blank" href="https://github.com/Thomas-Penner1/Trivia-Buzzer">GitHub</a>
        </div>
    )
}


export default function HomePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const addAppNotification = useUpdateAppNotificationContext();

    // Notify user why their game closed
    useEffect(() => {
        if (searchParams.get("close_reason")) {
            let close_reason = GetCloseReason(Number(searchParams.get("close_reason")))
            addAppNotification.displayAppNotification(close_reason);
        }
    }, []);
    

    function playerSelection() {
        router.push('/join');
    }

    async function moderatorSelection() {
        router.push('/create-game');
    }

    return (
        <div className="main-flex">
            <div className={styles.mainContent}>
                <VerticalCenteredDiv>
                    <HorizontalCenteredDiv>
                        <div className="middle-menu-background">
                            <div className={styles.infoSection}>
                                <h1>Online Trivia Buzzer</h1>
                                
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin metus sit amet arcu mattis.
                                </p>

                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin metus sit amet arcu mattis.
                                </p>

                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin metus sit amet arcu mattis.
                                </p>
                            </div>

                            <div className={styles.buttonOptions}>
                                <button onClick={playerSelection} className={styles.selectionButton}>
                                    Join Game
                                </button>

                                <div className={styles.buttonSeparator}>
                                    -or-
                                </div>

                                <button onClick={moderatorSelection} className={styles.selectionButton}>
                                    Create Game
                                </button>
                            </div>
                        </div>
                    </HorizontalCenteredDiv>
                </VerticalCenteredDiv>
            </div>

            <HomeFooter/>
        </div>
      );
}