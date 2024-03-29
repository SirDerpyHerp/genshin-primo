<script lang='ts'>
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    export let title: string | null
    export let input: (checked: boolean) => void
    export let defaultOn: boolean = false

    $: checked = writable(defaultOn)

    onMount(() => checked.subscribe(n => input(n)))
</script>

<div>
    <div class='flex items-center gap-2 p-1'>
        <Checkbox id={title} bind:checked={$checked}/>
        <Label for={title}>{title}</Label>
    </div>
</div>