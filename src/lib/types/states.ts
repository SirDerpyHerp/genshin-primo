import type { Event } from "./event"
import type { Version } from "./version"

export type InputState = {
    ver: Version,
    primo: number
    pulls: number
    starglitter: boolean
    charPity: number
    charGuarantee: boolean
    wepPity: number
    wepGuarantee: boolean
    wepFate: boolean
    welkin: number
    abyss: number
    theater: number
    bpAmount: number
    bpLevel: number
    events: Map<Event, number>
}
export type InputStateKeys = keyof InputState

export type SourceState = Map<string, number>

export type PullState = {
    pulls: number
    charPity: number
    charGuarantee: boolean
    wepPity: number
    wepGuarantee: boolean
    wepFate: number
}