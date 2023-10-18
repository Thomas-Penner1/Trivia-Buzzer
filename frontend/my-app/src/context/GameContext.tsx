'use client'

import { appConfig } from '@/app/config';
import { Game_ } from '@/data-structures/game';
import { Player } from '@/data-structures/player';
import { PlayerStatus } from '@/util/enums/PlayerStatus';
import { UserSocket, UserSocketEvent, UserSocketState } from '@/util/userSocket';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';

// This is basically all of the connection and game information we will need
// across the application
export interface UserState {
    is_host: boolean;
    user_id: string;
    game_id: string;

    // Connection information for the pages
    should_have_socket: boolean;
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

        should_have_socket: false,
        has_socket: false,
    } as UserState;
}


export interface PlayerStateContext {
    player: Player,
    activePlayer?: Player
}

function createNewPlayerState() {
    return {
        player: {
            id: "",
            points: 0,
            status: PlayerStatus.Pending,
        } as Player
    } as PlayerStateContext
}


// Contexts for both reading and updating (from component) the user states
const ConnectionContext = React.createContext<UserState>(createNewUserState());
const ConnectionUpdateContext = React.createContext<any>(null);

export function useConnection() {
    return useContext(ConnectionContext);
}

export function useConnectionUpdate() {
    return useContext(ConnectionUpdateContext);
}


// Context for both reading and updating (from component) the game states
// For use by host users
const GameContext = React.createContext<Game_>(new Game_());
const GameUpdateContext = React.createContext<any>(null);

export function useGame() {
    return useContext(GameContext);
}

export function useGameUpdate() {
    return useContext(GameUpdateContext);
}


const PlayerContext = React.createContext<PlayerStateContext>(createNewPlayerState());
const PlayerUpdateContext = React.createContext<any>(null);

export function usePlayer() {
    return useContext(PlayerContext);
}

export function usePlayerUpdate() {
    return useContext(PlayerUpdateContext);
}



// let userSocket: UserSocket | undefined = undefined;

interface GameProviderProps {
    children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [game, setGame] = useState(new Game_());
    const [playerState, setPlayerState] = useState(createNewPlayerState());
    const [userState, setUserState] = useState(createNewUserState());

    const userSocket = useRef<UserSocket | undefined>(undefined);


    // Redirect if we are not currently on the correct page to render
    useEffect(() => {
        if (userState.has_socket === true) {
            return;
        }

        if (pathname === "/" || pathname === "/create-game" || pathname === "/join") {
            return;
        }

        router.push(appConfig.clientBaseUrl);
    }, [pathname])


    // Initialize the socket that we are using
    useEffect(() => {
        if (userState.has_socket || !userState.should_have_socket) {
            return;
        }

        userState.has_socket = true;

        const new_socket = new UserSocket(userState.game_id, userState.user_id);

        new_socket.addListener(UserSocketEvent.CONNECT, () => {
            if (userSocket.current === undefined) {
                return;
            }

            userState.socketState = userSocket.current.socketState;
            userState.socketCloseReason = userSocket.current.socketCloseReason;

            userSocket.current.sendGetGame();

            updateState(userState)
        });

        new_socket.addListener(UserSocketEvent.GAME, () => {
            if (userSocket.current === undefined) {
                return;
            }

            updateGame(userSocket.current.currentGame);
        });

        new_socket.addListener(UserSocketEvent.PLAYER, () => {
            if (userSocket.current === undefined) {
                return;
            }

            playerState.player = userSocket.current.currentPlayer;
            playerState.activePlayer = userSocket.current.currentActivePlayer;

            updatePlayerState(playerState);
        });

        new_socket.addListener(UserSocketEvent.CLOSE, () => {
            if (userSocket.current === undefined) {
                return;
            }

            if (userSocket.current.socketCloseReason === undefined) {
                router.push(`${appConfig.clientBaseUrl}?close_reason=${1006}`);

            } else {
                router.push(`${appConfig.clientBaseUrl}?close_reason=${userSocket.current.socketCloseReason}`);
            }
        })

        userState.socketState = new_socket.socketState;
        userState.socketCloseReason = new_socket.socketCloseReason;

        userSocket.current = new_socket;

        updateState(userState);

    }, [userState]);


    // Creates an exact copy of the game, and then triggers the re-render
    function updateGame(newGame: Game_) {
        setGame(new Game_(newGame));
    }


    // Creates an exact copy of the user state for the re-render
    function updateState(newUserState: UserState)  {
        setUserState({...newUserState});
    }


    function updatePlayerState(newPlayerState: PlayerStateContext) {
        setPlayerState({...newPlayerState});
    }


    // Only makes sense once we have a game / socket
    function sendGetGame(): void {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendGetGame();
    }


    function clearConnection(): void {
        if (userSocket.current !== undefined) {
            userSocket.current.close();
            userSocket.current = undefined;
        }

        userState.should_have_socket = false;
        userState.has_socket = false;
        
        updateState(createNewUserState());
    }

    // HOST CONNECTION ========================================================
    function connectHost(game_id: string, user_id: string) {
        // userSocket.current = new UserSocket(game_id, user_id);

        // console.log(userState);

        userState.is_host = true;
        userState.game_id = game_id;
        userState.user_id = user_id;
        userState.should_have_socket = true;

        // console.log(userState);

        updateState(userState);

        // let newUserState = {
        //     is_host: true,
        //     user_id: game_id,
        //     game_id: user_id,
        //     game: new Game_(),
            
        //     has_socket: true,
        //     socketState: userSocket.current.socketState,
        //     socketCloseReason: userSocket.current.socketCloseReason,
        // } as UserState;

        // addListeners();

        // updateState(newUserState);
    }

    function sendRemovePlayer(user_id: string) {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendRemovePlayer(user_id);
    }

    function sendOpenRoom(): void {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendOpenRoom();
    }

    function sendCloseRoom(): void {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendCloseRoom();
    }

    function sendStartGame() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendStartGame();
    }

    function sendNextQuestion() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendNextQuestion();
    }

    function sendCorrectAnswer() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendCorrectAnswer();
    }

    function sendIncorrectAnswer() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendIncorrectAnswer();
    }

    function sendFinishGame() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.endGame();
    }

    // PLAYER CONNECTION ======================================================
    function connectPlayer(game_id: string, user_id: string) {
        userState.is_host = true;
        userState.game_id = game_id;
        userState.user_id = user_id;
        userState.should_have_socket = true;

        updateState(userState);
    }

    function sendSetUsername(username: string, callback: (arg0: any) => any) {
        if (userSocket.current === undefined) {
            return;
        }

        // let x = function(abc: any) {
        //     console.log(abc)
        // }

        userSocket.current.requestSetUsername(username, callback);
    }

    function sendBuzz() {
        if (userSocket.current === undefined) {
            return;
        }

        userSocket.current.sendBuzz();
    }

    // Component ==============================================================
    return (
        <ConnectionContext.Provider value={userState}>
            <ConnectionUpdateContext.Provider value={{
                clearConnection: clearConnection,
                connectHost: connectHost,
                connectPlayer: connectPlayer
            }}>
                <GameContext.Provider value={game}>
                    <GameUpdateContext.Provider value = {{
                        sendGetGame: sendGetGame,
                        // clearConnection: clearConnection,

                        // connectHost: connectHost,
                        sendRemovePlayer: sendRemovePlayer,
                        sendOpenRoom: sendOpenRoom,
                        sendCloseRoom: sendCloseRoom,
                        sendStartGame: sendStartGame,
                        sendNextQuestion: sendNextQuestion,
                        sendCorrectAnswer: sendCorrectAnswer,
                        sendIncorrectAnswer: sendIncorrectAnswer,
                        sendFinishGame: sendFinishGame,

                        // connectPlayer: connectPlayer,
                        // sendSetUsername: sendSetUsername,
                        // sendBuzz: sendBuzz,
                    }}>
                        <PlayerContext.Provider value={playerState}>
                            <PlayerUpdateContext.Provider value={{
                                sendGetGame: sendGetGame,
                                sendSetUsername: sendSetUsername,
                                sendBuzz: sendBuzz,
                            }}>
                                {children}
                            </PlayerUpdateContext.Provider>
                        </PlayerContext.Provider>
                    </GameUpdateContext.Provider>
                </GameContext.Provider>
            </ConnectionUpdateContext.Provider>
        </ConnectionContext.Provider>
    )
}