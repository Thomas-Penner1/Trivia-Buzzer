'use client'

import { useRouter } from "next/navigation";
import CenterForm from "../components/center-form";
import Background from "@/components/background";

import styles from './page.module.css'
import { appConfig } from './config'
import { StateManager } from "@/util/stateManager";

export default function HomePage() {
    const router = useRouter();

    function playerSelection() {
        router.push('/join');
    }

    // TODO: Add error handling!!!!
    async function moderatorSelection() {
        let url = appConfig.serverBaseUrl + "/buzzer/create-game";
        const response = await fetch(url, {
            method: "POST"
        });

        // TODO: add proper error handling
        if (response.status != 200) {
            return;
        }
        const result = await response.json();
        
        // Sets variables for later
        console.log(result.room_id);
        StateManager.initialize( result.room_id, result.user_id, true);

        router.push('moderator/setup');
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
         </main>
      );
}