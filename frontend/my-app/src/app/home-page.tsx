'use client'

import { useRouter } from "next/navigation";
import CenterForm from "../components/center-form";
import Background from "@/components/background";

import styles from './page.module.css'

export default function HomePage() {
    const router = useRouter();

    function playerSelection() {
        console.log('s')
        router.push('/join');
    }

    // TODO: Add error handling!!!!
    async function moderatorSelection() {
        // const response = await fetch("http://localhost:3000/buzzer/create", {
        //     method: "POST"
        // });

        // const result = await response.json();
        // console.log(result);

        router.push('moderator/setup');
    }

    return (
        <Background>
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
        </Background>
      );
}