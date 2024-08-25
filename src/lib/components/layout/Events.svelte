<script lang='ts'>
    import * as Card from "$lib/components/ui/card"
    import { Label } from "../ui/label";
    import { Separator } from "../ui/separator";
    import { events } from "$lib/data/events";
    import { input_state } from "../../store/pull_state";
    import type { Event } from "$lib/types/event";
    import CheckboxNumInput from "../ui/input/CheckboxNumInput.svelte";
    import { now } from "$lib/data/version_start";

    function input(e: Event) {
        return (checked: boolean, value: string) => {
            (checked)
            ? input_state.update(state => {
                state.events.set(e, (value != '') ? 100 - parseInt(value) : 100)
                return state
            })
            : input_state.update(state => {
                state.events.set(e, 0)
                return state
            })
        }
    }
</script>

<Card.Root class='h-full px-2'>
    <Card.Header class='flex items-center'>
        <Label class='text-xl'>Events</Label>
        <Separator/>
    </Card.Header>
    <Card.Content class='grid grid-cols-1 gap-4'>
        {#each events as e}
            {#if e.start.valueOf() <= now.valueOf() && e.end.valueOf() > now.valueOf()}
                <CheckboxNumInput input={input(e)} title={e.name} placeholder="Estimated percent of event done. (0-99)" max={99} defaultOn/>
            {/if}
        {/each}
    </Card.Content>
</Card.Root>