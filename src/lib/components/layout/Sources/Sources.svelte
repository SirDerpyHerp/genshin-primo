<script lang='ts'>
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator/";
    import { source_state } from "$lib/store/source_state";
    import { ScrollArea } from "$lib/components/ui/scroll-area/";
    import SourceItem from "./SourceItem.svelte";

    $: currentState = $source_state
</script>

<Card.Root class='px-2 overflow-hidden'>
    <Card.Header>
        <Label class='text-lg'>Sources</Label>
        <Separator/>
    </Card.Header>
    <Card.Content class='h-80'>
        <ScrollArea class="h-[18.5rem]">
            <div class="w-[calc(100%-0.75rem)]">
                {#each [...currentState].sort((n1, n2) => (n2[1] > n1[1]) ? 1 : -1) as [id, amount]}
                    {#if amount > 0}
                        <SourceItem title={id} amount={amount}/>
                    {/if}
                {/each}
            </div>
        </ScrollArea>
    </Card.Content>
</Card.Root>