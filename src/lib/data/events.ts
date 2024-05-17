import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 4,
    minor: 6,
    phase: 2
}
export const events: Event[] = [
    {
        name: "Iridescent Arataki Rockin' For Life Tour de Force of Awesomeness",
        reward: 1000,
        start: DateTime.local(2024, 5, 6),
        end: DateTime.local(2024, 5, 26),
    },
    {
        name: "Vibro-Crystal Applications",
        reward: 420,
        start: DateTime.local(2024, 4, 28),
        end: DateTime.local(2024, 5, 8),
    },
    {
        name: "Specially-Shaped Saurian Search",
        reward: 420,
        start: DateTime.local(2024, 5, 22),
        end: DateTime.local(2024, 6, 2),
    },
    {
        name: "Windtrace: Seekers and Strategy",
        reward: 420,
        start: DateTime.local(2024, 5, 14),
        end: DateTime.local(2024, 5, 26),
    }
]