import { PlayerStatus } from "@/util/enums/PlayerStatus";

export interface Player {
    id: string,
    username?: string,
    points: number,
    status: PlayerStatus,
}