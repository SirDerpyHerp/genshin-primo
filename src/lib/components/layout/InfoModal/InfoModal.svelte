<script lang='ts'>
    import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import InfoModalButton from "./InfoModalButton.svelte";
    import InfoTitle from "./InfoTitle.svelte";
    import InfoDescription from "./InfoDescription.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
  import { Label } from "$lib/components/ui/label";

    $: open = false
</script>

<Dialog open={open} onOpenChange={o => open=o}>
    <DialogTrigger asChild>
        <InfoModalButton on:click={() => open=true}/>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle class='text-center text-3xl'>
                Information
                <Separator class='my-2'/>
            </DialogTitle>
            <DialogDescription class='max-h-[80vh] text-left'>
                <ScrollArea class='h-[80vh]'>
                    <div class='pr-2'>
                        <!-- Would make a smarter way to do this but not sure how to do it -->
                    <!-- Hardcode gaming it is -->

                    <InfoTitle title='What is this? How do I use this?'/>
                    <InfoDescription>
                        It's a primo planner + probability calculator all in one!
                        <div class='py-1'/>
                        All you have to do is to pick what version and phase you want to calculate for and then fill in the assumptions in the input card.
                        <div class='py-1'/>
                        From there, you can check approximately how many pulls you can get and the chances of getting a certain constellation and weapon refine by checking the table.
                    </InfoDescription>
                    <div class='py-4'/>

                    <InfoTitle title='What are the assumptions?'/>
                    <InfoDescription>
                        Currently, the planner assumes:
                        <ul class='list-disc list-inside'>
                            <li>Dailies</li>
                            <li>1 Flagship Event per Patch</li>
                            <li>3 Minor Events per Patch</li>
                            <li>Stream Codes</li>
                            <li>Maintenance Compensation</li>
                            <li>Paimon's Bargains</li>
                            <li>Spiral Abyss</li>
                            <li>Paid Battle Pass</li>
                            <li>4 Starglitter per 10x</li>
                        </ul>
                        <div class='py-1'/>
                        Most notably, the planner doesn't assume exploration, unless it's part of an event like GAA.
                    </InfoDescription>
                    <div class='py-4'/>

                    <InfoTitle title='I want to add more assumptions!'/>
                    <InfoDescription>
                        You're going to have to calculate it by yourself and add it to the pulls/primogems section.
                        <div class='py-1'/>
                        You can also remove some assumptions by putting in a negative value, though it won't appear in the Sources box.
                        <div class='py-1'/>
                        If you want to make assumptions about exploration, <a class='text-blue-500' href='https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQ29M_-mbMbNgJl5c1ZWJwqgd1sFR6NW8A1Wwy85BUHCZHGtKwfrw_Jy68wd1OOyE6h7jQfEbOckjaM/pubhtml'>this spreadsheet</a> by @saber9529 has a tally for every new subregion since 1.2.
                    </InfoDescription>
                    <div class='py-4'/>

                    <InfoTitle title='How does the probability math work?'/>
                    <InfoDescription>
                        I didn't come up with this! It was originally made by @bryli06, I only transcribed it to Typescript and extended some of the functionalities.
                        <div class='py-1'/>
                        A link for an explanation can be found <a class='text-blue-500' href='https://drive.google.com/file/d/1EECcjNVpfiOTqRoS48hHWqH2Ake902vq/view?usp=sharing'>here</a>.
                    </InfoDescription>
                    <div class='py-4'/>

                    <InfoTitle title='HSR version when  ?'/>
                    <InfoDescription>
                        When I get a good list of assumptions <s> and can be bothered to.</s><br/>
                        If you want to use this as a probability calculator for HSR, it'll work for characters but not for light cones.
                    </InfoDescription>
                    <div class='py-4'/>
                    </div>
                </ScrollArea>
                <Label class='text-xs'>Made by @sirderpyherp</Label>
            </DialogDescription>
        </DialogHeader>
      </DialogContent>
</Dialog>