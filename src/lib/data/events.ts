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
        end: DateTime.local(2024, 9, 15),
    },
    {
        name: "Brilliant Dawn",
        reward: 1600,
        start: DateTime.local(2024, 8, 30),
        end: DateTime.local(2024, 9, 17),
    },
    {
        name: "Gift for a New Horizon",
        reward: 1600,
        start: DateTime.local(2024, 9, 28),
        end: DateTime.local(2024, 10, 7),
    },
    {
        name: "Of Thorns and Crowns",
        reward: 420,
        start: DateTime.local(2024, 9, 19),
        end: DateTime.local(2024, 9, 20),
    },
    {
        name: "Dodoco's Boom-Bastic Escapades",
        reward: 420,
        start: DateTime.local(2024, 9, 9),
        end: DateTime.local(2024, 9, 22),
    },
    {
        name: "Mementos of Teyvat",
        reward: 420,
        start: DateTime.local(2024, 9, 19),
        end: DateTime.local(2024, 9, 20),
    },

    // Extras, not part of the regular flagship + 3 minor
    {
        name: "5.0 Archon Quest Completion Bonus",
        reward: 500,
        start: DateTime.local(2024, 8, 28),
        end: DateTime.local(2024, 10, 8),
    },
    {
        name: "5.1 Archon Quest Completion Bonus",
        reward: 500,
        start: DateTime.local(2024, 10, 9),
        end: DateTime.local(2024, 11, 19),
    },
    {
        name: "5.3 Archon Quest Completion Bonus",
        reward: 500,
        start: DateTime.local(2025, 1, 1),
        end: DateTime.local(2025, 2, 11),
    }
]

export const theaterPrimosPerAct = [
    60, 60, 100, 60, 60, 100, 60, 120, 60, 120
]