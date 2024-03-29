// If you're here, you're probably wondering how this works
// I didn't come up with this! This was originally made by Bryli06 (https://github.com/Bryli06/akasha-serverless/)
// I just transcribed it to TS and extended some of the functionalities
// Bryli06's math explanation: https://drive.google.com/file/d/1EECcjNVpfiOTqRoS48hHWqH2Ake902vq/view

const CHAR_PROB = 0.006
const CHAR_RAMP = CHAR_PROB * 10

const CHAR_PROB_FUNC = Array.from(Array(91).keys()).map(i => i > 0 ? (i < 73 ? CHAR_PROB : Math.min(1, CHAR_PROB + CHAR_RAMP*(i - 73))) : 0)
const CHAR_PROB_COMPLEMENT = CHAR_PROB_FUNC.map(v => 1 - v)
const CHAR_CDF = CHAR_PROB_FUNC.map((v, i) => CHAR_PROB_COMPLEMENT.slice(0, i).reduce((cum, val) => cum * val, 1) * v)

const WEP_PROB = 0.007
const WEP_RAMP = WEP_PROB * 10

const WEP_PROB_FUNC = Array.from(Array(78).keys()).map(i => i > 0 ? (i < 62 ? WEP_PROB : Math.min(1, WEP_PROB + WEP_RAMP*(i - 62))) : 0)
const WEP_PROB_COMPLEMENT = WEP_PROB_FUNC.map(v => 1 - v)
const WEP_CDF = WEP_PROB_FUNC.map((v, i) => WEP_PROB_COMPLEMENT.slice(0, i).reduce((cum, val) => cum * val, 1) * v)

export function calc_character(pity: number, pulls: number, guarantee: boolean) {
    const cons = 6
    const pity_sum = CHAR_CDF.slice(0, pity+1).reduce((cum, val) => cum += val, 0)
    let gf_coeffs: number[][] = Array<number[]>(2*(cons + 1))

    pulls = Math.min(180*7 + 77*3*5, pulls)
    
    gf_coeffs[0] = Array<number>(pity + pulls + 92).fill(0)
    for (let i = pity+1; i < 91; i++) {
        gf_coeffs[0][i] = CHAR_CDF[i]/(1 - pity_sum)
    }
    for (let i = 1; i < 2*(cons + 1); i++) {
        gf_coeffs[i] = Array<number>(pity + pulls + 92).fill(0)
        for (let j = 1; j < Math.min(90*i+1, pulls+pity); j++) {
            const temp = gf_coeffs[i-1][j]
            for (let k = 0; k < 91; k++) {
                gf_coeffs[i][j+k] = Math.min(1, gf_coeffs[i][j+k] + temp * CHAR_CDF[k])
            }
        }   
    }

    // console.log(gf_coeffs[3][105])

    const non_guarantee_filer = [0, .5, .5]
    const filter = guarantee ? [0, 1, 0] : non_guarantee_filer
    let path_gf_coeffs = Array<number[]>(cons + 1)

    path_gf_coeffs[0] = Array<number>(2*cons + 3).fill(0)
    path_gf_coeffs[0][0] = filter[0]
    path_gf_coeffs[0][1] = filter[1]
    path_gf_coeffs[0][2] = filter[2]

    for (let i = 1; i < cons + 1; i++) {
        path_gf_coeffs[i] = Array<number>(2*cons + 3).fill(0)
        for (let j = 1; j < 2*i+1; j++) {
            const temp = path_gf_coeffs[i-1][j]
            for (let k = 0; k < 3; k++) {
                path_gf_coeffs[i][j+k] += temp * non_guarantee_filer[k]
            }
        }
    }

    let ans = Array<number[]>(cons+1)
    for (let i = 0; i < cons+1; i++) {
        ans[i] = Array<number>(pity + pulls + 92).fill(0)
    }

    // This is the actually slow function for super big Ns, just return 100% if pulls are too big
    if ((pulls + pity) < 3000) {
        path_gf_coeffs.forEach((prob, con) => {
            prob.slice(1).forEach((x, i) => {
                if (i < 1100) {
                    ans[con] = ans[con].map((v, k) => Math.max(0, Math.min(1, v + (x * gf_coeffs[i][k]))))
                } else {
                    ans[con] = ans[con].map(() => 0)
                }
            })
        })
    } else {
        for (let con = 0; con < cons+1; con++) {
            ans[con] = ans[con].fill(0)
            ans[con][0] = 1
        }
    }

    return ans
}

export function calc_weapon(pity: number, pulls: number, fate: number, guarantee: boolean) {
    const refine = 5
    const pity_sum = WEP_CDF.slice(0, pity+1).reduce((cum, val) => cum += val, 0)
    let gf_coeffs: number[][] = Array<number[]>(3*refine)

    pulls = Math.min(180*7 + 77*3*5, pulls)
    
    gf_coeffs[0] = Array<number>(pity + pulls + 79).fill(0)
    for (let i = pity+1; i < 78; i++) {
        gf_coeffs[0][i] = WEP_CDF[i]/(1 - pity_sum)
    }
    for (let i = 1; i < 3*refine; i++) {
        gf_coeffs[i] = Array<number>(pity + pulls + 79).fill(0)
        for (let j = 1; j < Math.min(77*i+1, pulls+pity); j++) {
            const temp = gf_coeffs[i-1][j]
            for (let k = 0; k < 78; k++) {
                gf_coeffs[i][j+k] += temp * WEP_CDF[k]
            }
        }   
    }

    const non_guarantee_filer = [0, 0.375, 0.265625, 0.359375] // [0 5*, 1 5*, 2 5*, 3 5*]
    const filter = (fate == 0) ? (guarantee ? [0, 0.5, 0.1875, 0.3125] : non_guarantee_filer) :
        (fate == 1) ? (guarantee ? [0, 0.5, 0.5, 0] : [0, 0.375, 0.625, 0]) : [0, 1, 0, 0]
    let path_gf_coeffs = Array<number[]>(5)

    path_gf_coeffs[0] = Array<number>(3*refine + 1).fill(0)
    path_gf_coeffs[0][0] = filter[0]
    path_gf_coeffs[0][1] = filter[1]
    path_gf_coeffs[0][2] = filter[2]
    path_gf_coeffs[0][3] = filter[3]

    for (let i = 1; i < refine; i++) {
        path_gf_coeffs[i] = Array<number>(3*refine + 1).fill(0)
        for (let j = 1; j < 3*i+1; j++) {
            const temp = path_gf_coeffs[i-1][j]
            for (let k = 0; k < 4; k++) {
                path_gf_coeffs[i][j+k] += temp * non_guarantee_filer[k]
            }
        }
    }

    let ans = Array<number[]>(refine)
    for (let i = 0; i < refine; i++) {
        ans[i] = Array<number>(pity + pulls + 79).fill(0)
    }

    // This is the actually slow function for super big Ns, just return 100% if pulls are too big
    if ((pulls + pity) < 3000) {
        path_gf_coeffs.forEach((prob, r) => {
            prob.slice(1).forEach((x, i) => {
                ans[r] = ans[r].map((v, k) => Math.max(0, Math.min(1, v + (x * gf_coeffs[i][k]))))
            })
        })
    } else {
        for (let r = 0; r < refine; r++) {
            ans[r] = ans[r].fill(0)
            ans[r][0] = 1
        }
    }

    return ans
}

function multiplyPolys(a: number[], b: number[]) {
    let res = Array<number>(a.length + b.length - 1).fill(0)
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            res[i+j] += a[i]*b[j]
        }
    }
    return res
}

export function calc_char_and_wep(c_pity: number, c_guarantee: boolean, w_pity: number, w_guarantee:boolean, w_fate: number, pulls: number) {
    const char_res = calc_character(c_pity, pulls, c_guarantee)
    const wep_res = calc_weapon(w_pity, pulls, w_fate, w_guarantee)
    let result = Array<number[]>(8)

    for (let con = 0; con < 8; con++) {
        result[con] = Array<number>(6)
        for (let refine = 0; refine < 6; refine++) {
            if (refine > 0 && con > 0) {
                const char = char_res[con-1].slice(c_pity)
                const wep = wep_res[refine-1].slice(w_pity)
                // console.log(con-1, refine)
                
                // Poly multiplication is very expensive
                if ((pulls + c_pity + w_pity) < 180*7 + 77*3*5) {
                    result[con][refine] = multiplyPolys(char, wep).slice(0, pulls+1).reduce((c, v) => c += v, 0)
                } else {
                    result[con][refine] = 1
                }
            } else if (refine < 1 && con > 0) {
                result[con][refine] = char_res[con-1].slice(0, c_pity+pulls+1).reduce((c, v) => c += v, 0)
            } else if (con < 1 && refine > 0) {
                result[con][refine] = wep_res[refine-1].slice(0, w_pity+pulls+1).reduce((c, v) => c += v, 0)
            }
        }
    }

    result[0][0] = 1
    // console.log(result)
    return [result, char_res, wep_res]
}