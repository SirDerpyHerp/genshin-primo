<script lang='ts'>
    import * as Table from "$lib/components/ui/table";

    export let prob: number[][]
</script>
<Table.Root>
    <Table.Header>
        <Table.Row>
            <Table.Head class='h-1 w-1'>C\R</Table.Head>
            {#each {length: 6} as _, i}
                <Table.Head class='h-1 text-center'>{i > 0 ? i : 'X'}</Table.Head>
            {/each}
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each prob as perCons, i_c}
            <Table.Row>
                <Table.Cell class='w-1'>{i_c-1 > -1 ? i_c - 1 : 'X'}</Table.Cell>
            {#each perCons as totProb, i_w}
                <Table.Cell class='text-center'>{(totProb*100).toPrecision(4)}%</Table.Cell>
            {/each}
            </Table.Row>
        {/each}
      </Table.Body>
</Table.Root>