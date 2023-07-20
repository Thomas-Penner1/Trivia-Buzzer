'use client'

import Link from 'next/link';

import { useRouter } from "next/navigation";
import { FormEvent } from 'react';

import BackButton from '@/components/back-button';
import CenterForm from '@/components/center-form';

// A component allow a user to join a game, or return to the
// selection screen
export default function UsernameSelection() {
    const router = useRouter();

    const cat = sessionStorage.getItem("myCat");
    console.log(cat);

    // Handle the submit event on the form submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        let username = form.username.value;

        let data = {
            username: form.username.value
        };

        // const response = await fetch("http://localhost:3000/buzzer/ID/username", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(data),
        // })

        // const result = await response.text();

        let isSuccess = true as boolean;

        // Handle the results from the username selection
        if (isSuccess) {
            sessionStorage.setItem("username", username);
            router.push("http://localhost:3000/play");
        } else {

        }
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