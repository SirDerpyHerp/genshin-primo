<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
    import { writable, type Writable } from "svelte/store";

    export let graphType: Writable<string>
</script>

<div class='grid gap-2'>
    <Label class='text-lg'>Chart Controls</Label>
    <div class='grid gap-2'>
        <RadioGroup value={$graphType} onValueChange={(val) => $graphType = val}>
            <div class='flex items-center space-x-2'>
                <RadioGroupItem value='char'/><Label>Character</Label>
            </div>
            <div class='flex items-center space-x-2'>
                <RadioGroupItem value='wep'/><Label>Weapon</Label>
            </div>
            <div class='flex items-center space-x-2'>
                <RadioGroupItem value='disable'/><Label>Disable</Label>
            </div>
        </RadioGroup>
    </div>
</div>