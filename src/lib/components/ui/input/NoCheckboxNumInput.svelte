<script lang='ts'>
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";

    $: value = ''
    export let title: string | null = null
    export let placeholder: string
    export let input: (value: string) => void
    export let max: number | null = null
    export let disabled: boolean = false
    export let canNegative: boolean = false

    $: if (disabled) {
        input('')
    } else {
        input(value)
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
</script>
<div>
    {#if title}
        <Label class="flex items-center p-1">{title}:</Label>
    {/if}
    <Input type="tel" placeholder={placeholder} on:input={sanitizeAndBind} on:input={() => input(value)} disabled={disabled}/>
</div>