import { PlayerStatus } from "@/util/enums/PlayerStatus";

export interface Player {
    readonly id: string,
    username?: string,
    points: number,
    status: PlayerStatus,
}