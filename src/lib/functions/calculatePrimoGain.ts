import { HAS_STREAM_HAPPENED, events, events_updated_until, theaterPrimosPerAct } from "$lib/data/events"
import { base_ver, base_version_start, min_ver, MILLISECONDS_IN_DAY, now } from "$lib/data/version_start"
import type { InputState } from "$lib/types/states"
import type { Version } from "$lib/types/version"
import { DateTime } from 'luxon'
import { getVersionInt, getVersionFromInt } from "./versions"

function countOdd(l: number, r: number) {
    return Math.floor((r - l) / 2) + ((l % 2 != 0 || r % 2 != 0) ? 1 : 0)
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function getUpdateDate(ver: Version): DateTime {
    const phaseGap = getVersionInt(ver) - getVersionInt(base_ver) + 1

    return DateTime.fromMillis(base_version_start.valueOf() + (phaseGap * 21 + 1) * MILLISECONDS_IN_DAY - MILLISECONDS_IN_DAY, {zone: 'utc'})
}

function calcDailies(state: InputState) {
    const daysTilUpdate = Math.floor(getUpdateDate(state.ver).diff(now, 'days').days)

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
    const dateDiff = dateToUpdate.diff(now, ['months', 'days', 'hours'])
    const abyssResets = dateDiff.months + (mod(16 - now.day, now.daysInMonth) < dateDiff.days ? 1 : 0)

    const abyssPrimosPerCycle = Math.floor(state.abyss/3) * 50 + Math.floor(state.abyss/9) * 50
    const abyssPrimos = abyssPrimosPerCycle * abyssResets

    return abyssPrimos
}

function calcTheater(state: InputState) {
    const dateToUpdate = getUpdateDate(state.ver)
    const dateDiff = dateToUpdate.diff(now, ['months', 'days', 'hours'])
    const theaterResets = dateDiff.months + (mod(1 - now.day, now.daysInMonth) < dateDiff.days ? 1 : 0)

    const theaterPrimosPerCycle = state.theater > 0 ? theaterPrimosPerAct.slice(0, state.theater).reduce((x, tot) => tot += x) : 0
    const theaterPrimos = theaterPrimosPerCycle * theaterResets

    return theaterPrimos
}

function calcBP(state: InputState) {
    if (state.bpAmount < 0) return 0;
    const currentVer = getVersionInt(min_ver)
    const lastVer = getVersionInt(state.ver)
    const verCount = countOdd(currentVer, lastVer) - (min_ver.phase == 1 ? 1 : 0)

    const nextPhaseDate = getUpdateDate(min_ver).plus({ days: 1 })
    const daysTilNextPhase = Math.floor(nextPhaseDate.diff(now, 'days').days)
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

    console.log(dateToUpdate.toJSDate())

    events.forEach((e) => {
        if (e.start.valueOf() > dateToUpdate.valueOf()) return;
        if (e.end.valueOf() < now.valueOf()) return;
        
        const eventData = state.events.get(e)
        const eventLeft = eventData !== undefined ? eventData/100 : 1
        eventPrimos.set(e.name, Math.floor(e.reward * eventLeft))
    })

    if (getVersionInt(state.ver) > getVersionInt(events_updated_until)) {
        for (let i = getVersionInt(events_updated_until) + 1; i <= getVersionInt(state.ver); i++) {
            const ver = getVersionFromInt(i)
            if (ver.phase % 2 == 1) {
                // Mock Phase 1
                eventPrimos.set(`${ver.major}.${ver.minor} Flagship`, 1000)
                eventPrimos.set(`${ver.major}.${ver.minor} Minor Event 1`, 420)
            } else {
                // Mock Phase 2 
                eventPrimos.set(`${ver.major}.${ver.minor} Minor Event 2`, 420)
                eventPrimos.set(`${ver.major}.${ver.minor} Minor Event 3`, 420)
            }
        }
    }

    return eventPrimos
}

function calcPaimonsBargains(state: InputState) {
    const monthsToUpdate = Math.floor(getUpdateDate(state.ver).diff(now, 'months').months)

    return monthsToUpdate*5*160
}

function calcTrial(state: InputState) {
    const phaseCount = getVersionInt(state.ver) - getVersionInt(min_ver)

    return phaseCount * 40
}

export function calculatePrimos(state: InputState): [number, typeof pull_state, Map<string, number>] {
    const newSourceMap = new Map<string, number>()
    const [welkinPrimos, dailyPrimos] = calcDailies(state)

    newSourceMap.set('Welkin', welkinPrimos)
    newSourceMap.set('Daily', dailyPrimos)

    const [maintenancePrimos, streamPrimos] = calcPerVer(state)

    newSourceMap.set(`Maintenance`, maintenancePrimos)
    newSourceMap.set(`Stream`, streamPrimos)

    const paimonsBargainsPrimos = calcPaimonsBargains(state)
    newSourceMap.set("Paimon's Bargains", paimonsBargainsPrimos)

    const abyssPrimos = calcAbyss(state)

    newSourceMap.set('Spiral Abyss', abyssPrimos)

    const theaterPrimos = calcTheater(state)

    newSourceMap.set('Imaginarium Theater', theaterPrimos)

    const bpPrimos = calcBP(state)

    newSourceMap.set('Battle Pass', bpPrimos)

    const trialPrimos = calcTrial(state)

    newSourceMap.set('Character Trials', trialPrimos)

    const eventPrimos = calcEvents(state)
    let totalEventPrimos = 0
    eventPrimos.forEach((val, e) => {
        newSourceMap.set(e, val)
        totalEventPrimos += val
    })

    const totalPrimos = state.primo + dailyPrimos + welkinPrimos + abyssPrimos + theaterPrimos + maintenancePrimos + paimonsBargainsPrimos + streamPrimos + bpPrimos + trialPrimos + totalEventPrimos
    const totalPullsPreGlitter = Math.max(0, Math.floor(totalPrimos/160) + state.pulls)

    let glitterPulls = 0
    if (state.starglitter) {
        let lastGlitterPull = Math.floor(totalPullsPreGlitter/10 * 4/5)
        while (lastGlitterPull >= 1) {
            console.log(lastGlitterPull)
            glitterPulls += lastGlitterPull
            lastGlitterPull = Math.floor(lastGlitterPull/10 * 4/5)
        }
    }
    const totalPulls = totalPullsPreGlitter + glitterPulls

    newSourceMap.set('Starglitter', glitterPulls*160)

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