<script lang='ts'>
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";

    $: value = ''
    export let title: string | null = null
    export let placeholder: string
    export let input: (value: string) => void
    export let max: number | null = null
    export let disabled: boolean = false

    $: if (disabled) {
        input('')
    } else {
        input(value)
    }

    function sanitizeAndBind(e: Event) {
        const target = e.target as HTMLTextAreaElement
        if (!target) return
        
        const n = parseInt(target.value)
        if (target.value == '' || n < 0) {
            target.value = ''
            value = ''
            return
        }

        if (max) {
            target.value = Math.min(parseInt(target.value.slice(0, Math.ceil(Math.log10(max)))), max).toString()
        }

        value = target.value
    }
</script>
<div>
    {#if title}
        <Label class="flex items-center p-1">{title}:</Label>
    {/if}
    <Input type="number" placeholder={placeholder} on:input={sanitizeAndBind} on:input={() => input(value)} disabled={disabled}/>
</div>