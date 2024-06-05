import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 4,
    minor: 7,
    phase: 2 // Always 2
}
export const events: Event[] = [
    {
        name: "Mutual Security Enhancing Simulation",
        reward: 1000,
        start: DateTime.local(2024, 6, 7),
        end: DateTime.local(2024, 6, 16),
    },
    {
        name: "Record of Reflective Writing",
        reward: 420,
        start: DateTime.local(2024, 6, 18),
        end: DateTime.local(2024, 6, 23),
    },
    {
        name: "Endless Forms Most Martial",
        reward: 420,
        start: DateTime.local(2024, 6, 27),
        end: DateTime.local(2024, 6, 28),
    },
    {
        name: "Spino Doubleblaster",
        reward: 420,
        start: DateTime.local(2024, 6, 27),
        end: DateTime.local(2024, 6, 28),
    }
]