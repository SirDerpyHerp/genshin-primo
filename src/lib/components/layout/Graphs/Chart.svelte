<script lang="ts">
    import { Line } from 'svelte-chartjs'
    import type { ChartData, ChartDataset } from "chart.js";
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale
    } from 'chart.js';

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale,
    );

    const MAX_POINTS = 250

    export let graphType: string
    export let pullData: number[][]
    export let pullCount: number
    export let pity: number
    let calcedData = false

    $: points = pullCount < MAX_POINTS ? pullCount : MAX_POINTS
    $: graphData = {
        labels: Array.from(Array(points).keys()).map(x => Math.floor(pullCount/points * (x+1))),
        datasets: getDataset(pullData, pullCount, pity, graphType),
    } as ChartData<'line', number[]>
    
    const colors = [
        [225,204,230],
        [225,50,230],
        [50,204,230],
        [225,204,50],
        [50,204,50],
        [50,50,230],
        [225,50,50],
    ]
    function getColor(i: number, alpha: number) {
        const c = colors[i]
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`
    }
    function getDataset(pullData: number[][], pullCount: number, pity: number, graphType: string) {
        const dataset = [] as ChartDataset<'line', number[]>[]
        const drawOptions = {
            spanGaps: (points > 100),
            pointRadius: points > 100 ? 0 : Math.max(.5, Math.min(4, 50/points)),
            pointBorderWidth: Math.min(4, 30/points),
        }
        if (pullData == undefined) return [];
        if (pullData[0] == undefined) return []

        calcedData = true
        if (graphType == 'char') {
            for (let con = 0; con < 7; con++) {
                const data = [] as number[]

                data.push((pullData[con].slice(pity, pity+Math.floor(pullCount/points)+1).reduce((c, v) => c += v, 0) + (pity > 0 ? pullData[con][0] : 0)) * 100)
                for (let point = 2; point <= points; point++) {
                    data.push(data[data.length-1] + pullData[con].slice(
                        pity+Math.floor(pullCount/points * (point-1))+1,
                        pity+Math.floor(pullCount/points * point)+1
                    ).reduce((c, v) => c += v, 0) * 100)
                }

                // console.log(data)

                dataset.push({
                    label: `C${con}`,
                    data: data,
                    backgroundColor: getColor(con, .5),
                    borderColor: getColor(con, .5),
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: getColor(con, .75),
                    pointBorderColor: getColor(con, .5),
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgb(0, 0, 0)',
                    pointHoverBorderColor: getColor(con, .5),
                    pointHoverBorderWidth: 2,
                    pointHitRadius: 10,
                    ...drawOptions
                })
            }
        } else if (graphType == 'wep') {
            for (let refine = 1; refine < 6; refine++) {
                const data = [] as number[]

                data.push((pullData[refine-1].slice(pity, pity+Math.floor(pullCount/points)+1).reduce((c, v) => c += v, 0) + (pity > 0 ? pullData[refine-1][0] : 0)) * 100)
                for (let point = 2; point <= points; point++) {
                    data.push(data[data.length-1] + pullData[refine-1].slice(
                        pity+Math.floor(pullCount/points * (point-1))+1,
                        pity+Math.floor(pullCount/points * point)+1
                    ).reduce((c, v) => c += v, 0) * 100)
                }

                // console.log(data)

                dataset.push({
                    label: `R${refine}`,
                    data: data,
                    backgroundColor: getColor(refine, .5),
                    borderColor: getColor(refine, .5),
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: getColor(refine, .75),
                    pointBorderColor: getColor(refine, .5),
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgb(0, 0, 0)',
                    pointHoverBorderColor: getColor(refine, .5),
                    pointHoverBorderWidth: 2,
                    pointHitRadius: 10,
                    ...drawOptions
                })
            }
        } else {
            return []
        }
        
        // console.log(dataset)
        return dataset
    }
</script>

{#if graphType !== 'disable' && calcedData}
<Line
    data={graphData}
    options={{
        color: 'white',
        animation: {
            duration: 0
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    color: "white",
                    callback: (v) => `${v}%`
                }
            }
        },
        interaction: {
            mode: "index",
            intersect: false
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: item => `${item.dataset.label}: ${item.formattedValue}%`
                }
            }
        },
        maintainAspectRatio: false,
        responsive: true
    }}
/>
{/if}