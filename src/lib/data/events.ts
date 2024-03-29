import type { Event } from "$lib/types/event";
import type { Version } from "$lib/types/version";

export const events_updated_until: Version = {
    major: 4,
    minor: 5,
    phase: 2
}
export const events: Event[] = [
    {
        name: "Alchemical Ascension",
        reward: 1000,
        start: new Date(2024, 2, 14),
        end: new Date(2024, 3, 1),
    },
    {
        name: "The Great Fayz Reaction Debate",
        reward: 420,
        start: new Date(2024, 2, 22),
        end: new Date(2024, 3, 3),
    },
    {
        name: "Feline Fortress Furrdyssey",
        reward: 420,
        start: new Date(2024, 3, 4),
        end: new Date(2024, 3, 6),
    }
    ,
    {
        name: "Rolling Crossfire",
        reward: 420,
        start: new Date(2024, 3, 4),
        end: new Date(2024, 3, 6),
    }
]