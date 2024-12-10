import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 5,
    minor: 2,
    phase: 2 // Always 2
}
export const HAS_STREAM_HAPPENED = false
export const events: Event[] = [
    {
        name: "Iktomi Spiritseeking Scrolls",
        reward: 1000,
        start: DateTime.local(2024, 11, 28),
        end: DateTime.local(2024, 12, 15),
    },
    {
        name: "Claw Convoy",
        reward: 420,
        start: DateTime.local(2024, 11, 22),
        end: DateTime.local(2024, 12, 1),
    },
    {
        name: "Exercise Surging Storm",
        reward: 420,
        start: DateTime.local(2024, 12, 18),
        end: DateTime.local(2024, 12, 29),
    },
    {
        name: "Adventurer's Trials: Metamorphosis",
        reward: 420,
        start: DateTime.local(2024, 12, 11),
        end: DateTime.local(2024, 12, 22),
    },


    // Extras, not part of the regular flagship + 3 minor
    {
        name: "Chasca Story Quest",
        reward: 60,
        start: DateTime.local(2024, 11, 20),
        end: DateTime.local(2024, 12, 9),
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