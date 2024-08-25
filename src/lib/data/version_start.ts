import { getVersionFromInt, getVersionInt } from "$lib/functions/versions"
import type { Version } from "$lib/types/version"
import { DateTime } from 'luxon'

// const now_nonUTC = DateTime.now()
const now_nonUTC = DateTime.utc(2025, 2, 10)
export const now = (DateTime.utc(now_nonUTC.year, now_nonUTC.month, now_nonUTC.day) as unknown) as DateTime<true> // Ugly as hell, but utc can sometimes be invalid
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

// Use 4.5 as the base
export const base_ver: Version = {
    major: 4,
    minor: 5,
    phase: 1
}
export const base_version_start = DateTime.utc(2024, 3, 12)
const diff_from_base = now.diff(base_version_start, ['days', 'hours'])
const phase_diff_til_now = Math.floor(diff_from_base.days / 21)

export const min_ver = getVersionFromInt(getVersionInt(base_ver) + phase_diff_til_now)
export const HAS_STREAM_HAPPENED = false