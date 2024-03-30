import { min_ver } from "$lib/data/version_start";
import type { Event } from "$lib/types/event";
import type { InputState, PullState } from "$lib/types/states";
import { writable, type Writable } from "svelte/store";

export const input_state: Writable<InputState> = writable({
    ver: min_ver,
    primo: 0,
    pulls: 0,
    starglitter: false,
    charPity: 0,
    charGuarantee: false,
    wepPity: 0,
    wepGuarantee: false,
    wepFate: 0,
    welkin: 0,
    abyss: 0,
    bpAmount: -1,
    bpLevel: 0,
    events: new Map<Event, number>
})

export const pull_state: Writable<PullState> = writable();

// pull_state.subscribe((v) => {
//     console.log(v)
// })