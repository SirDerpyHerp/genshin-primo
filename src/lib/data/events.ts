import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 5,
    minor: 3,
    phase: 2 // Always 2
}
export const HAS_STREAM_HAPPENED = false
export const events: Event[] = [
    {
        name: "Springtime Charms",
        reward: 1000,
        start: DateTime.local(2025, 1, 22),
        end: DateTime.local(2025, 2, 10),
    },
    {
        name: "May Fortune Find You: Spring's Premonition",
        reward: 3200,
        start: DateTime.local(2025, 1, 22),
        end: DateTime.local(2025, 2, 10),
    },
    {
        name: "Shuyu's Baffling Beetle Battle Bowl",
        reward: 420,
        start: DateTime.local(2025, 1, 3),
        end: DateTime.local(2025, 1, 12),
    },
    {
        name: "Emblem of Steadfast Valor",
        reward: 420,
        start: DateTime.local(2025, 1, 9),
        end: DateTime.local(2025, 1, 19),
    },
    {
        name: "On the Trail of Behemoths",
        reward: 420,
        start: DateTime.local(2025, 1, 14),
        end: DateTime.local(2025, 1, 26),
    },

    // Extras, not part of the regular flagship + 3 minor
    {
        name: "Mavuika Story Quest",
        reward: 60,
        start: DateTime.local(2025, 1, 1),
        end: DateTime.local(2025, 1, 20),
    },
    {
        name: "Citlali Story Quest",
        reward: 60,
        start: DateTime.local(2025, 1, 1),
        end: DateTime.local(2025, 1, 20),
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