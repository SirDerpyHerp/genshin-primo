<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Label } from "$lib/components/ui/label/";
  //@ts-ignore
  import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte'
</script>

<Button variant="ghost" class="ml-auto w-14 aspect-square" on:click>
    <div class='w-full h-full'>
        <MdInfoOutline/>
    </div>  
</Button>