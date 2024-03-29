import type { Event } from "$lib/types/event";
import type { SourceState } from "$lib/types/states";
import { writable, type Writable } from "svelte/store";

export const source_state: Writable<SourceState> = writable(new Map<string, number>())

// pull_state.subscribe((v) => {
//     console.log(v)
// })