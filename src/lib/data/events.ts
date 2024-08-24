import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 5,
    minor: 0,
    phase: 2 // Always 2
}
export const events: Event[] = [
    {
        name: "Traces of Artistry",
        reward: 1000,
        start: DateTime.local(2024, 8, 28),
        end: DateTime.local(2024, 9, 29),
    },
    {
        name: "Brilliant Dawn",
        reward: 1600,
        start: DateTime.local(2024, 8, 30),
        end: DateTime.local(2024, 9, 17),
    },
    {
        name: "Gift for a New Horizon: A Thank-You Gift",
        reward: 1600,
        start: DateTime.local(2024, 9, 28),
        end: DateTime.local(2024, 10, 7),
    },
    {
        name: "Of Thorns and Crowns",
        reward: 420,
        start: DateTime.local(2024, 8, 28),
        end: DateTime.local(2024, 9, 29),
    },
    {
        name: "Dodoco's Boom-Bastic Escapades",
        reward: 420,
        start: DateTime.local(2024, 9, 19),
        end: DateTime.local(2024, 9, 20),
    },
    {
        name: "Mementos of Teyvat",
        reward: 420,
        start: DateTime.local(2024, 9, 19),
        end: DateTime.local(2024, 9, 20),
    }
]

export const theaterPrimosPerAct = [
    60, 60, 100, 60, 60, 100, 60, 120, 60, 120
]