import { EventEmitter } from "events";
import { Player } from "./player";
import { StateManager } from "@/util/stateManager";
import { PlayerStatus } from "@/util/enums/PlayerStatus";

export class PlayerController extends EventEmitter {
    player: Player;

    // Events that can be emmitted by this object ============================
    get ConnectEvent() {
        return "ConnectEvent";
    }

    get NextQuestionEvent() {
        return "NextQuestionEvent";
    }

    get CorrectAnswerEvent() {
        return "CorrectAnswerEvent";
    }

    get IncorrectAnswerEvent() {
        return "IncorrectAnswerEvent";
    }

    // Success / Fail events =========
    get SuccessUsernameEvent() {
        return "CorrectUsernameEvent";
    }

    get FailUsernameEvent() {
        return "FailUsernameEvent";
    }

    get SuccessBuzzEvent() {
        return "SuccessBuzzEvent";
    }

    get FailBuzzEvent() {
        return "FailBuzzEvent";
    }

    // Overload getters of the object by returning player values =============
    get id() {
        return this.player.id;
    }

    get username() {
        return this.player.username;
    }

    get points() {
        return this.player.points;
    }

    get status() {
        return this.player.status;
    }

    // Method definitions ====================================================
    constructor(player: Player) {
        super();

        this.player = player;

        // Event listeners for object modification
        StateManager.addListener(StateManager.ConnectEvent, () => {
            this.emit(this.ConnectEvent);
        });

        StateManager.addListener(StateManager.ContinueEvent_NextQuestion, () => {
            this.emit(this.NextQuestionEvent);
        });
    }

    // TrySetUsername - if the attempt is successfull, then we actually set
    // the username, and notify the user that it has been updated
    trySetUsername(username: string) {
        StateManager.setUsername(username);

        StateManager.once(StateManager.SuccessEvent_Username, () => {
            this._setUsername(username);
            this.emit(this.SuccessUsernameEvent);
        });

        StateManager.once(StateManager.FailureEvent_Username, () => {
            StateManager.removeAllListeners(StateManager.SuccessEvent_Username);
            this.emit(this.FailUsernameEvent);
        })
    }

    // Tries to buzz in - if the attempt is successful, then we will let the
    // user know. If the attempt is unsuccessful, then we simply do nothing
    tryBuzz() {
        StateManager.buzz();

        StateManager.once(StateManager.SuccessEvent_Buzz, () => {
            this.emit(this.SuccessBuzzEvent);
        });

        StateManager.once(StateManager.FailureEvent_Buzz, () => {
            StateManager.removeAllListeners(StateManager.SuccessEvent_Buzz);
            this.emit(this.FailBuzzEvent);
        })
    }

    setState(playerStatus: PlayerStatus) {
        this.player.status = playerStatus;
    }

    // Private methods =======================================================
    _setUsername(username: string) {
        this.player.username = username;
    }
}