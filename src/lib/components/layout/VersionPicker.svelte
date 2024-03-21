<script>
    import * as Card from '$lib/components/ui/card/index'
    import { Button } from '../ui/button/index';
    import { Label } from '../ui/label';
    import { input_state } from '../../store/pull_state';
    // @ts-ignore
    import MdChevronRight from 'svelte-icons/md/MdChevronRight.svelte'
    // @ts-ignore
    import MdChevronLeft from 'svelte-icons/md/MdChevronLeft.svelte'
    import { assumed_last_minor_ver, min_ver } from '$lib/data/version_start';

    $: ver = {
        major: min_ver.major,
        minor: min_ver.minor,
        phase: min_ver.phase
    }
    $: verString = `${ver.major}.${ver.minor}`
    $: decrementEnable = false

    function increment() {
        if (ver.phase == 1) {
            ver.phase++
        } else {
            ver.phase = 1
            if (ver.minor < assumed_last_minor_ver) {
                ver.minor++
            } else {
                ver.major++
                ver.minor = 0
            }
        }

        decrementEnable = true
        $input_state = {
            ...$input_state,
            ver: ver
        }
    }

    function decrement() {
        if (ver.phase == 1) {
            ver.phase = 2
            if (ver.minor > 0) {
                ver.minor--
            } else {
                ver.major--
                ver.minor = assumed_last_minor_ver
            }
        } else {
            ver.phase--
        }
        
        if (ver.major == min_ver.major && ver.minor == min_ver.minor && ver.phase == min_ver.phase) {
            decrementEnable = false
        }

        $input_state = {
            ...$input_state,
            ver: ver
        }
    }
</script>

<Card.Root>
    <div class='h-full flex justify-between items-center box-border w-full'>
        <Button class='mr-2 min-h-full max-w-16' variant="ghost" on:click={decrement} disabled={!decrementEnable}>
            <MdChevronLeft/>
        </Button>
        <Label class='text-xl'>Version {verString} Phase {ver.phase}</Label>
        <Button class='ml-2 min-h-full max-w-16' variant="ghost" on:click={increment}>
            <MdChevronRight/>
        </Button>
    </div>
</Card.Root>