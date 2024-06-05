<script lang='ts'>
    import * as Card from '$lib/components/ui/card/index'
    import NoCheckboxNumInput from '../ui/input/NoCheckboxNumInput.svelte';
    import CheckboxNumInput from '../ui/input/CheckboxNumInput.svelte';
    import CheckboxInput from '../ui/input/CheckboxInput.svelte';
    import { input_state } from '$lib/store/pull_state';
    import type { InputStateKeys } from '$lib/types/states';
    import { min_ver } from '$lib/data/version_start';

    $: fatePointDisabled = false
    $: bpDisabled = true
    
    function numInput(id: Exclude<InputStateKeys, 'events' | 'ver' | 'charGuarantee' | 'wepGuarantee' | 'starglitter'>) {
        return (value: string) => $input_state[id] = value ? parseInt(value) : 0
    }

    function checkboxInput(id: 'charGuarantee' | 'wepGuarantee' | 'starglitter') {
        return (checked: boolean) => $input_state[id] = checked
    }

    function checkedNumInput(id: Exclude<InputStateKeys, 'events' | 'ver' | 'charGuarantee' | 'wepGuarantee' | 'starglitter'>) {
        return (checked:boolean, value: string) => $input_state[id] = (checked ? parseInt(value) || 0 : 0)
    }

    function bpInput(checked:boolean, value: string) {
        bpDisabled = !checked
        $input_state['bpAmount'] = checked ? parseInt(value) || 0 : -1
    }

    input_state.subscribe(state => fatePointDisabled = state.ver.major != min_ver.major || state.ver.minor != min_ver.minor || state.ver.phase != min_ver.phase)
</script>

<Card.Root class='px-2 flex'>
    <div class="grid gap-4 p-6 grid-cols-1 flex-1">
        <NoCheckboxNumInput input={numInput('primo')} title='Primogems' placeholder="Saved up primogems." canNegative/>
        <NoCheckboxNumInput input={numInput('pulls')} title="Pulls" placeholder="Saved up pulls" canNegative/>
        <CheckboxInput input={checkboxInput('starglitter')} title="Use Starglitter for Pulls"/>
        <div class='grid gap-2'>
            <CheckboxInput input={checkboxInput('charGuarantee')} title="Character Guarantee"/>
            <NoCheckboxNumInput input={numInput('charPity')} title="Character Pity" placeholder="Pity in the character banner." max={89}/>
        </div>
        <div class='grid gap-2'>
            <CheckboxInput input={checkboxInput('wepGuarantee')} title="Wep Guarantee"/>
            <NoCheckboxNumInput input={numInput('wepPity')} title="Weapon Pity" placeholder="Pity in the weapon banner." max={79}/>
            <NoCheckboxNumInput input={numInput('wepFate')} title="Weapon Fate Points" placeholder="Fate point in the weapon banner." max={2} disabled={fatePointDisabled}/>
        </div>
        <CheckboxNumInput input={checkedNumInput('welkin')} title="Welkin" placeholder="Days of welkin left."/>
        <CheckboxNumInput input={checkedNumInput('abyss')} title="Abyss (Still 600 max)" placeholder="Number of abyss stars (0 - 36)" max={36}/>
        <!-- This shit is so hacked together I hate it -->
        <div class='grid gap-3'>
            <CheckboxNumInput input={bpInput} title="Paid BP" placeholder="Extra patches of paid BP."/>
            <NoCheckboxNumInput input={numInput('bpLevel')} placeholder="This week's final BP level" max={50} disabled={bpDisabled}/>
        </div>
    </div>
</Card.Root>