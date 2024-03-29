import type { DateTime } from "luxon"

export type Event = {
    name: string
    reward: number
    start: DateTime
    end: DateTime
}