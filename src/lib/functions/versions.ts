import type { Version } from "$lib/types/version"

export const assumed_last_minor_ver = 8
export function getVersionInt(ver: Version) {
    return (ver.minor + (ver.major - 4) * (assumed_last_minor_ver + 1)) * 2 + ver.phase
}

export function getVersionFromInt(versionInt: number) {
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