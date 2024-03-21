<script lang='ts'>
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator/";
    import { source_state } from "$lib/store/source_state";
    import SourceItem from "./SourceItem.svelte";

    function toTitleCase(str: string) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    $: currentState = $source_state
</script>

<Card.Root class='h-full px-2]'>
    <Card.Header>
        <Label class='text-lg'>Sources</Label>
        <Separator/>
    </Card.Header>
    <Card.Content class='flex flex-wrap'>
        {#each [...currentState].sort((n1, n2) => (n2[1] > n1[1]) ? 1 : -1) as [id, amount]}
            {#if amount > 0}
                <SourceItem title={toTitleCase(id)} amount={amount}/>
            {/if}
        {/each}
    </Card.Content>
</Card.Root>