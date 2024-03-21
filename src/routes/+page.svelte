<script>
    import VersionPicker from "$lib/components/layout/VersionPicker.svelte";
    import Inputs from "$lib/components/layout/Inputs.svelte";
    import Events from "$lib/components/layout/Events.svelte";
    import Totals from "$lib/components/layout/Totals.svelte";
    import Sources from "$lib/components/layout/Sources/Sources.svelte";
    import GraphsCard from "$lib/components/layout/Graphs/GraphsCard.svelte"

    import { Label } from "$lib/components/ui/label";
    import { ModeWatcher } from "mode-watcher";
    import "../app.pcss";
</script>

<svelte:head>
    <title>Genshin Primo Planner</title>
</svelte:head>

<header class='flex justify-center items-center px-2'>
    <Label class='h-full text-3xl'>Genshin Primo Planner</Label>
</header>

<ModeWatcher defaultMode={"dark"}/>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2 h-[128rem] lg:h-vh">
    <div class='row-span-1 md:row-span-1'>
        <VersionPicker/>
    </div>
    <div class='row-span-5 lg:row-start-2 lg:row-end-7 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Inputs/> 
        <Events/>
    </div>
    <div class='row-span-1 lg:row-start-7'>
        <Totals/>
    </div>
    <div class='row-span-6 lg:col-start-2 lg:row-start-1 lg:row-end-6'>
        <GraphsCard/>
    </div>
    <div class='row-span-5 lg:col-start-2 lg:row-start-6 lg:row-end-13'>
        <Sources/>
    </div>
</div>