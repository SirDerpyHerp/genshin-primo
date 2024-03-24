<script lang='ts'>
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    export let title: string | null
    export let placeholder: string
    export let max: number | null = null;
    export let input: (checked: boolean, value: string) => void
    export let defaultOn: boolean = false
    export let canNegative: boolean = false

    $: checked = writable(defaultOn)
    $: value = ''

    function clamp(n: number, min: number, max: number) {
        return Math.max(min, Math.min(n, max))
    }

    function sanitizeAndBind(e: Event) {
        const target = e.target as HTMLTextAreaElement
        if (!target) return
        
        const n = parseInt(target.value, 10)
        console.log(n, target.value)
        if (target.value == '') {
            target.value = ''
            value = ''
            return
        }
        if (Number.isNaN(n)) {
            value = ''
            if (!(target.value == '-' && canNegative)) target.value = ''
            return
        }
        if ((n < 0 && !canNegative)) {
            target.value = n < 0 ? `${-n}` : ''
            value = target.value
            return
        }

        if (max) {
            target.value = Math.min(parseInt(target.value.slice(0, Math.ceil(Math.log10(max)))), max).toString()
        }

        value = target.value
    }

    onMount(() => checked.subscribe((c) => input(c, value)))
</script>

<div>
    <div class='flex items-center gap-2 p-1'>
        <Checkbox id={title} bind:checked={$checked}/>
        <Label for={title}>{title}: </Label>
    </div>
    <Input type="number" placeholder={placeholder} disabled={!$checked} on:input={sanitizeAndBind} on:input={() => input($checked, value)}/>
</div>