<script lang="ts">
  import { Label } from "$lib/components/ui/label";

    export let title: string
    export let amount: number
</script>

<div class='flex basis-full'>
    <Label class='flex-none text-base'>{title}</Label>
    <div class='grow'/>
    <Label class='flex-none text-base'>{amount} (*)</Label>
</div>