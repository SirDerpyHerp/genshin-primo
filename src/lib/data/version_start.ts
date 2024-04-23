import type { Version } from "$lib/types/version"
import { DateTime } from 'luxon'

// Should really automate this
export const min_ver: Version = {
    major: 4,
    minor: 5,
    phase: 2
}

// Use 4.5 as the base
export const base_ver: Version = {
    major: 4,
    minor: 5,
    phase: 1
}
export const base_version_start = DateTime.utc(2024, 3, 12, 22)

export const assumed_last_minor_ver = 8