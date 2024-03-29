import type { Version } from "$lib/types/version"

export const min_ver: Version = {
    major: 4,
    minor: 5,
    phase: 1
}

// Use 4.5 as the base
export const base_ver: Version = {
    major: 4,
    minor: 5,
    phase: 1
}
export const base_version_start = new Date(2024, 2, 13)

export const assumed_last_minor_ver = 8