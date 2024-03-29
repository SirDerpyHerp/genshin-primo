import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";
import { DateTime } from 'luxon'

export const events_updated_until: Version = {
    major: 4,
    minor: 5,
    phase: 2
}
export const events: Event[] = [
    {
        name: "Alchemical Ascension",
        reward: 1000,
        start: DateTime.local(2024, 3, 14),
        end: DateTime.local(2024, 4, 1),
    },
    {
        name: "The Great Fayz Reaction Debate",
        reward: 420,
        start: DateTime.local(2024, 3, 22),
        end: DateTime.local(2024, 4, 3),
    },
    {
        name: "Feline Fortress Furrdyssey",
        reward: 420,
        start: DateTime.local(2024, 4, 4),
        end: DateTime.local(2024, 4, 6),
    }
    ,
    {
        name: "Rolling Crossfire",
        reward: 420,
        start: DateTime.local(2024, 4, 4),
        end: DateTime.local(2024, 4, 6),
    }
]