'use client'

import { useRouter } from "next/navigation";
import CenterForm from "../components/center-form";
import Background from "@/components/background";

import styles from './page.module.css'
import { appConfig } from './config'
import { StateManager } from "@/util/stateManager";
import Loader from "@/components/loader";
import AppNotification from "@/components/notification";
import { useState } from "react";

export default function HomePage() {
    const router = useRouter();

    function playerSelection() {
        router.push('/join');
        // setShowError(true);
    }

    async function moderatorSelection() {
        router.push('moderator/setup');
        // setShowError(false);
    }

    // Render page based on how we get there
    // Option 1:
    // Query Parameters
    // Option 2:
    // State Variables
    // Messages that we need to prepare to render:
    // - Game ended by server
    // - Game ended by host
    // - Removed from game by host

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