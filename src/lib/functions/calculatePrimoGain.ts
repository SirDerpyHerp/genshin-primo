import { events, events_updated_until } from "$lib/data/events"
import { assumed_last_minor_ver, base_ver, base_version_start, min_ver } from "$lib/data/version_start"
import type { InputState } from "$lib/types/states"
import type { Version } from "$lib/types/version"
import { DateTime } from 'luxon'

const now = DateTime.now()
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000
const HAS_STREAM_HAPPENED = true

function getVersionInt(ver: Version) {
    return (ver.minor + (ver.major - 4) * (assumed_last_minor_ver + 1)) * 2 + ver.phase
}

function getVersionFromInt(versionInt: number) {
    const phase = versionInt % 2
    if (phase % 2 == 1) {versionInt -= 1} else {versionInt -= 2}

    const assumed_minor = versionInt / 2
    const major = Math.floor(assumed_minor / (assumed_last_minor_ver + 1)) + 4
    const minor = assumed_minor - (major - 4) * (assumed_last_minor_ver + 1)

    return {
        major: major,
        minor: minor,
        phase: (phase == 0 ? phase + 2 : phase)
    }
}

function countOdd(l: number, r: number) {
    return Math.floor((r - l) / 2) + ((l % 2 != 0 || r % 2 != 0) ? 1 : 0)
}

export function getUpdateDate(ver: Version): DateTime {
    const phaseGap = getVersionInt(ver) - getVersionInt(base_ver) + 1

    return DateTime.fromMillis(base_version_start.valueOf() + (phaseGap * 21 + 1) * MILLISECONDS_IN_DAY - MILLISECONDS_IN_DAY, {zone: 'utc'})
}

function calcDailies(state: InputState) {
    const daysTilUpdate = Math.floor(getUpdateDate(state.ver).diffNow('days').days)

    const welkinPrimos = 90 * (daysTilUpdate > state.welkin ? state.welkin : daysTilUpdate)
    const dailyPrimos = 60 * daysTilUpdate

    return [welkinPrimos, dailyPrimos]
}

function calcPerVer(state: InputState) {
    const currentVer = getVersionInt(min_ver)
    const lastVer = getVersionInt(state.ver)
    const verCount = countOdd(currentVer, lastVer)

    const streamCount = (lastVer - currentVer + 1) - verCount - (HAS_STREAM_HAPPENED ? 1 : 0)
    const maintenancePrimos = (verCount - (min_ver.phase == 1 ? 1 : 0)) * 600
    const streamPrimos = streamCount * 300

    return [maintenancePrimos, streamPrimos]
}

function calcAbyss(state: InputState) {
    const dateToUpdate = getUpdateDate(state.ver)
    const monthsTilUpdate = Math.floor(dateToUpdate.diffNow('months').months)
    const abyssResets = Math.max(0, (monthsTilUpdate - 1)*2) + (now.day > 1 && now.day < 16 ? 1 : 0) + (dateToUpdate.day > 1 ? 1 : 0) + (dateToUpdate.day > 16 ? 1 : 0)
    const abyssPrimos = Math.floor(state.abyss/3) * 50 * abyssResets

    return abyssPrimos
}

function calcBP(state: InputState) {
    if (state.bpAmount < 0) return 0;
    const currentVer = getVersionInt(min_ver)
    const lastVer = getVersionInt(state.ver)
    const verCount = countOdd(currentVer, lastVer) - (min_ver.phase == 1 ? 1 : 0)

    const nextPhaseDate = getUpdateDate(min_ver).plus({ days: 1 })
    const daysTilNextPhase = Math.floor(nextPhaseDate.diffNow('days').days)
    const mondaysBetweenNowAndNextPhase = Math.floor(daysTilNextPhase / 7) + (now.weekday == 1 ? 2 : 1)

    const maxBP = Math.min(verCount, state.bpAmount)

    let bpPrimos = 0

    // Calculate current phase
    const phaseMaxLevel = Math.min(mondaysBetweenNowAndNextPhase*10 + state.bpLevel, 50)
    bpPrimos += Math.max(0, Math.floor((Math.min(49, phaseMaxLevel) - state.bpLevel)/10)) * 160
    bpPrimos += (phaseMaxLevel == 50 && state.bpLevel < 50 ? 680 : 0)

    // Calculate primos for next phase if same version
    if (min_ver.phase == 1 && phaseMaxLevel < 50 && lastVer > currentVer) {
        bpPrimos += Math.floor((40 - phaseMaxLevel + 1)/10) * 160
        bpPrimos += 680
    }

    if (maxBP > 0) {
        bpPrimos += 1320*maxBP - ((lastVer - currentVer) / 2 <= maxBP && state.ver.phase == 1 ? 680 + 160 : 0)
    }

    return bpPrimos
}

function calcEvents(state: InputState) {
    const dateToUpdate = getUpdateDate(state.ver)
    const eventPrimos = new Map<string, number>

    events.forEach((e) => {
        if (e.start.valueOf() > dateToUpdate.valueOf()) return;
        if (e.end.valueOf() < now.valueOf()) return;
        
        const eventData = state.events.get(e)
        const eventLeft = eventData !== undefined ? eventData/100 : 1
        eventPrimos.set(e.name, Math.floor(e.reward * eventLeft))
    })

    for (let i = getVersionInt(events_updated_until) + 1; i <= getVersionInt(state.ver); i++) {
        const ver = getVersionFromInt(i)
        if (ver.phase % 2 == 1) {
            // Mock Phase 1
            eventPrimos.set(`${ver.major}.${ver.minor} flagship`, 1000)
            eventPrimos.set(`${ver.major}.${ver.minor} minor event 1`, 420)
        } else {
            // Mock Phase 2 
            eventPrimos.set(`${ver.major}.${ver.minor} minor event 2`, 420)
            eventPrimos.set(`${ver.major}.${ver.minor} minor event 3`, 420)
        }
    }

    return eventPrimos
}

function calcPaimonsBargains(state: InputState) {
    const monthsToUpdate = Math.floor(getUpdateDate(state.ver).diffNow('months').months)

    return monthsToUpdate*5*160
}

export function calculatePrimos(state: InputState): [number, typeof pull_state, Map<string, number>] {
    const newSourceMap = new Map<string, number>()
    const [welkinPrimos, dailyPrimos] = calcDailies(state)

    newSourceMap.set('welkin', welkinPrimos)
    newSourceMap.set('daily', dailyPrimos)

    const [maintenancePrimos, streamPrimos] = calcPerVer(state)

    newSourceMap.set(`maintenance`, maintenancePrimos)
    newSourceMap.set(`stream`, streamPrimos)

    const paimonsBargainsPrimos = calcPaimonsBargains(state)
    newSourceMap.set("paimon's bargains", paimonsBargainsPrimos)

    const abyssPrimos = calcAbyss(state)

    newSourceMap.set('abyss', abyssPrimos)

    const bpPrimos = calcBP(state)

    newSourceMap.set('battle pass', bpPrimos)

    const eventPrimos = calcEvents(state)
    let totalEventPrimos = 0
    eventPrimos.forEach((val, e) => {
        newSourceMap.set(e, val)
        totalEventPrimos += val
    })

    const totalPrimos = state.primo + dailyPrimos + welkinPrimos + abyssPrimos + maintenancePrimos + paimonsBargainsPrimos + streamPrimos + bpPrimos + totalEventPrimos
    const totalPullsPreGlitter = Math.max(0, Math.floor(totalPrimos/160) + state.pulls)

    const glitterPulls = state.starglitter ? Math.floor(Math.floor(totalPullsPreGlitter/10) * 4/5) : 0
    const totalPulls = totalPullsPreGlitter + glitterPulls

    newSourceMap.set('starglitter', glitterPulls*160)

    const pull_state = {
        pulls: totalPulls,
        charPity: state.charPity,
        charGuarantee: state.charGuarantee,
        wepPity: state.wepPity,
        wepGuarantee: state.wepGuarantee,
        wepFate: state.wepFate
    }
    const source_state = newSourceMap

    return [ totalPulls, pull_state, source_state ]
}