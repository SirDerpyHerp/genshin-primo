<script lang='ts'>
    import * as Card from "$lib/components/ui/card";
    import Chart from "./Chart.svelte";
    import ChartControls from "./ChartControls.svelte";
    import ProbabilityTable from "./ProbabilityTable.svelte";
    import { pull_state } from '$lib/store/pull_state';
    import { calc_char_and_wep } from "$lib/functions/probability";
    import { writable, type Writable } from "svelte/store";
    
    const probability_states: Writable<number[][]> = writable([])
    const graphType = writable('char')

    $: pullData = [] as number[][]
    $: pullCount = $pull_state.pulls
    $: pity = 0

    function update(state: typeof $pull_state) {
        const [prob_states, char_res, wep_res] = calc_char_and_wep(state.charPity, state.charGuarantee, Math.min(76, state.wepPity), state.wepGuarantee, state.wepFate, state.pulls)

        $probability_states = prob_states
        pullData = $graphType == 'char' ? char_res : wep_res
        pullCount = state.pulls
        pity = $graphType == 'char' ? state.charPity : state.wepPity
    }

    pull_state.subscribe(update)
    graphType.subscribe(() => update($pull_state))
</script>
<Card.Root class='p-4 gap-4 grid grid-cols-1 lg:grid-cols-2 min-h-32'>
    <div class='col-span-12'>
        <ProbabilityTable prob={$probability_states}/>
    </div>
    <div class='min-h-56 col-span-12 lg:col-span-10'>
        <Chart graphType={$graphType} pullData={pullData} pullCount={pullCount} pity={pity}/>
    </div>
    <div class='lg:col-span-2'>
        <ChartControls graphType={graphType}/>
    </div>
</Card.Root>