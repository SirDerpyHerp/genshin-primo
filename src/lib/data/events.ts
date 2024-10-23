import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 5,
    minor: 1,
    phase: 2 // Always 2
}
export const HAS_STREAM_HAPPENED = false
export const events: Event[] = [
    {
        name: "Chromatic Ode of Candies and Roses",
        reward: 1000,
        start: DateTime.local(2024, 10, 23),
        end: DateTime.local(2024, 11, 6),
    },
    {
        name: "Aphid Treasure Trace",
        reward: 420,
        start: DateTime.local(2024, 10, 10),
        end: DateTime.local(2024, 10, 20),
    },
    {
        name: "Reminiscent Regimen: Thrill",
        reward: 420,
        start: DateTime.local(2024, 10, 17),
        end: DateTime.local(2024, 10, 27),
    },
    {
        name: "Feast of Pursuit",
        reward: 420,
        start: DateTime.local(2024, 10, 30),
        end: DateTime.local(2024, 10, 31),
    },
    {
        name: "Marvelous Merchandise",
        reward: 380,
        start: DateTime.local(2024, 10, 30),
        end: DateTime.local(2024, 10, 31),
    },

    // Extras, not part of the regular flagship + 3 minor
    {
        name: "5.1 Archon Quest Completion Bonus",
        reward: 500,
        start: DateTime.local(2024, 10, 9),
        end: DateTime.local(2024, 11, 19),
    },
    {
        name: "Xilonen Story Quest",
        reward: 60,
        start: DateTime.local(2024, 10, 9),
        end: DateTime.local(2024, 10, 29),
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