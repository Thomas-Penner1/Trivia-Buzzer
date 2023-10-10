'use client'

import { Game_ } from '@/data-structures/game';
import { UserSocket, UserSocketEvent, UserSocketState } from '@/util/userSocket';
import React, { ReactNode, useContext, useEffect, useState } from 'react';


// This is basically all of the connection and game information we will need
// across the application
export interface UserState {
    is_host: boolean;
    user_id: string;
    game_id: string;
    game: Game_;

    // Connection information for the pages
    has_socket: boolean;
    socketState?: UserSocketState;
    socketCloseReason?: number;
};

// Creates a new default user state to be consumed in the app
function createNewUserState () {
    return {
        is_host: false,
        user_id: "",
        game_id: "",
        game: new Game_(),
        
        has_socket: false,
    } as UserState;
}




const GameContext = React.createContext(createNewUserState());
const GameUpdateContext = React.createContext<any>(null);

export function useGame() {
    return useContext(GameContext);
}

export function useGameUpdate() {
    return useContext(GameUpdateContext);
}




let userSocket: UserSocket | undefined = undefined;

interface GameProviderProps {
    children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
    const [userState, setUserState] = useState(createNewUserState());

    function updateState(newUserState: UserState)  {
        setUserState({...newUserState});
    }

    function addListeners() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.addListener(UserSocketEvent.CONNECT, () => {
            let newUserState = userState;
            
            newUserState.socketState = userSocket?.socketState;
            newUserState.socketCloseReason = userSocket?.socketCloseReason;

            updateState(newUserState);
        });

        userSocket.addListener(UserSocketEvent.GAME, () => {
            let newUserState = userState;
            
            newUserState.socketState = userSocket?.socketState;
            newUserState.socketCloseReason = userSocket?.socketCloseReason;

            updateState(newUserState);
        });

        userSocket.addListener(UserSocketEvent.CLOSE, () => {
            let newUserState = userState;
            
            newUserState.socketState = userSocket?.socketState;
            newUserState.socketCloseReason = userSocket?.socketCloseReason;

            updateState(newUserState);
        });
    }

    function sendGetGame(): void {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendGetGame();
    }

    // HOST CONNECTION ========================================================
    function connectHost(game_id: string, user_id: string) {
        userSocket = new UserSocket(game_id, user_id);

        let newUserState = {
            is_host: true,
            user_id: game_id,
            game_id: user_id,
            game: new Game_(),
            
            has_socket: true,
            socketState: userSocket.socketState,
            socketCloseReason: userSocket.socketCloseReason,
        } as UserState;

        addListeners();

        updateState(newUserState);
    }

    function sendRemovePlayer(user_id: string) {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendRemovePlayer(user_id);
    }

    function sendOpenRoom(): void {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendOpenRoom();
    }

    function sendCloseRoom(): void {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendCloseRoom();
    }

    function sendStartGame() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendStartGame();
    }

    function sendNextQuestion() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendNextQuestion();
    }

    function sendCorrectAnswer() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendCorrectAnswer();
    }

    function sendIncorrectAnswer() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendIncorrectAnswer();
    }

    function sendFinishGame() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.endGame();
    }

    // PLAYER CONNECTION ======================================================
    function connectPlayer(game_id: string, user_id: string) {
        let userSocket = new UserSocket(game_id, user_id);

        let newUserState = {
            is_host: false,
            user_id: game_id,
            game_id: user_id,
            game: new Game_(),
            
            has_socket: true,
            socketState: userSocket.socketState,
            socketCloseReason: userSocket.socketCloseReason,
        } as UserState;

        addListeners();

        updateState(newUserState);
    }

    function sendSetUsername(username: string) {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendSetUsername(username);
    }

    function sendBuzz() {
        if (userSocket === undefined) {
            return;
        }

        userSocket.sendBuzz();
    }

    // Component ==============================================================
    return (
        <GameContext.Provider value={userState}>
            <GameUpdateContext.Provider value = {{
                sendGetGame: sendGetGame,

                connectHost: connectHost,
                sendRemovePlayer: sendRemovePlayer,
                sendOpenRoom: sendOpenRoom,
                sendCloseRoom: sendCloseRoom,
                sendStartGame: sendStartGame,
                sendNextQuestion: sendNextQuestion,
                sendCorrectAnswer: sendCorrectAnswer,
                sendIncorrectAnswer: sendIncorrectAnswer,
                sendFinishGame: sendFinishGame,

                connectPlayer: connectPlayer,
                sendSetUsername: sendSetUsername,
                sendBuzz: sendBuzz,
            }}>
                    {children}
            </GameUpdateContext.Provider>
        </GameContext.Provider>
    )
}