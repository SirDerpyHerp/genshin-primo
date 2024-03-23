<script lang='ts'>
    import * as Card from "$lib/components/ui/card"
    import { input_state, pull_state } from "../../store/pull_state";
    import { onMount } from "svelte";
    import { Label } from "../ui/label";
    import { calculatePrimos } from "$lib/functions/calculate";
    import { source_state } from "$lib/store/source_state";
    $: totalPulls = 0

    function calculate(state: typeof $input_state) {
        const [ tPulls, pState, sState ] = calculatePrimos(state)
        totalPulls = tPulls
        $pull_state = pState
        $source_state = sState
    }

    input_state.subscribe(calculate)

    onMount(() => calculate($input_state))
</script>

<Card.Root class='h-full flex justify-start items-center box-border px-2'>
    <div class='p-2 text-lg lg:text-xl'>
        <Label class='text-lg lg:text-xl'>Total Pulls: </Label>{totalPulls.toLocaleString()} Pulls
    </div>
</Card.Root>