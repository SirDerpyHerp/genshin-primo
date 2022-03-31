import { CardContent, Divider, TextField, Grid, FormControlLabel, Checkbox, CardHeader, Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Card from './Components/Card'
import Calendar, { get_now, to_utc } from './Components/Calendar/'
import Primogem from './Components/Primogem'
import StarTextField from './Components/StarTextField'
import Events from './Assets/events.json'
//import Events from './Components/Events'
import './App.css'

const DAY_IN_MS = 86400000

function App() {
    const [bpCheck, setBp] = React.useState(false)
    const [welkinCheck, setWelkin] = React.useState(false)
    const [expectedPrimos, setExpectedPrimos] = React.useState(0)
    const [welkinDays, setWelkinDays] = React.useState(0)
    const [bpLvl, setBpLvl] = React.useState(0)
    const [hasUnknownEvent, setUnknownEvent] = React.useState(false)
    const [hasEstimated, setEstimated] = React.useState(false)
    const [abyssFloors, setAbyssFloors] = React.useState([0, 0, 0, 0])
    const [day, setDay] = React.useState(get_now())
    const today = get_now()

    const sanitizeNumberInput = (val: string) => {
        const num = parseInt(val)
        if (!isNaN(num)) {
            return Math.abs(num)
        }
        return NaN
    }
    const sanitizeBPInput = (val: string) => {
        const num = sanitizeNumberInput(val)
        if (!isNaN(num)) {
            return num > 50 ? 50 : num
        }
        return ''
    }
    const sanitizeWelkinInput = (val: string) => {
        const num = sanitizeNumberInput(val)
        if (!isNaN(num)) {
            return num
        }
        return ''
    }
    const sanitizeAbyssInput = (val: string) => {
        const num = sanitizeNumberInput(val)
        if (!isNaN(num)) {
            return num > 9 ? parseInt(num.toString()[0]) : num
        }
        return ''
    }

    const getHeight = (e: Element | null) => {
        if (e) {
            const h = getComputedStyle(e).bottom
            return parseInt(h)
        }
    
        return 0
    }
    
    const updateLegend = () => {
        let eventsCount: {[key: string]: [number, number]} = {}
        let unknownEvent = false
        let estimated = false

        Object.entries(Events).forEach(event => {
            const tags = document.getElementsByClassName(`${event[0]}-tag`)
    
            if (tags.length > 0) {
                if (event[1].hasOwnProperty('estimated')) { estimated = true }
                if (event[1].hasOwnProperty('unknown')) { unknownEvent = true }
                if (tags.item(0)) {
                    eventsCount[event[0]] = [tags.length, (getHeight(tags.item(0)))]
                }
            } else {
                eventsCount[event[0]] = [0, 0]
            }
        })

        setUnknownEvent(unknownEvent)
        setEstimated(estimated)
    
        let maxHeight = 0
        for (let event in eventsCount) {
            const count = eventsCount[event][0];
            const legend = document.getElementById(`${event}-legend`)
    
            if (legend) {
                if (count === 0) {
                    legend.style.setProperty('height', '0px')
                    legend.style.setProperty('font-size', '0rem')
                    legend.style.setProperty('padding-bottom', '0px')
                } else {
                    legend.style.setProperty('height', 'unset')
                    legend.style.setProperty('font-size', '1rem')
                    legend.style.setProperty('padding-bottom', '2px')
    
                    maxHeight = maxHeight < eventsCount[event][1] ? eventsCount[event][1] : maxHeight
                }
            }
        }
        return maxHeight
    }

    const onAbyssChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, f: number) => {
        e.target.value = sanitizeAbyssInput(e.target.value).toString()
        let newAbyss = [...abyssFloors]
        newAbyss[f] = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
        setAbyssFloors(newAbyss)
    }

    type Event = {
        start: Date
        end: Date
        totalDur: number
        name: string
        color: string
        primos: number
        eventDur?: number
        rushable?: boolean
        average?: boolean
    }

    useEffect(() => {
        let checkDay = today
        let welkinDaysLeft = welkinDays
        let currentBPLvl = bpLvl
        let expected = 0
        let events = [...Object.entries(Events).map(e => {
            let event = {...e[1], start: to_utc(new Date(e[1].start)), end: to_utc(new Date(e[1].end))} as Event
            event.totalDur = (event.end.valueOf() - event.start.valueOf())/DAY_IN_MS + 1
            return event
        })]

        checkDay.setDate(checkDay.getDate() + 1)
        while ((checkDay.valueOf() - day.valueOf()) <= DAY_IN_MS) {
            expected += 60

            // Welkin
            if (welkinDaysLeft > 0 && welkinCheck) {
                welkinDaysLeft--    
                expected += 90
            }

            // Abyss
            if (checkDay.getDate() === 1 || checkDay.getDate() === 16) {
                const stars = abyssFloors.reduce((a, b) => a+b)
                expected += 50 * Math.floor(stars/3)
            }

            // BP
            if (checkDay.getDay() === 0 && bpCheck) {
                if (currentBPLvl < 40) {
                    expected += 160
                    currentBPLvl += 10
                } else if (currentBPLvl < 50) {
                    expected += 680
                    currentBPLvl += 10
                }
            }

            // Paimon's Bargains
            if (checkDay.getDate() === 1) {
                expected += 800
            }

            // Reset BP Level
            if ((to_utc(new Date(2022, 2, 31)).getTime() - checkDay.getTime())/DAY_IN_MS % 42 === 0) { // Use start of 2.6 
                currentBPLvl = 0
            }

            // Events
            events.forEach(e => {
                if (checkDay.valueOf() >= e.start.valueOf() && checkDay.valueOf() <= e.end.valueOf()) {
                    if (e.rushable && checkDay.valueOf() === e.start.valueOf()) {
                        expected += e.primos
                    }

                    if (e.eventDur) {
                        if ((checkDay.valueOf() - e.start.valueOf())/DAY_IN_MS < e.eventDur) {
                            expected += e.primos/e.eventDur
                        }
                    }

                    if (e.average) {
                        expected += e.primos/e.totalDur
                    }
                }
            })
            
            checkDay.setDate(checkDay.getDate() + 1)
        }

        setExpectedPrimos(expected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welkinDays, bpLvl, day, abyssFloors, bpCheck, welkinCheck]) 

    useEffect(() => {
        updateLegend()
    })
    return <Grid container spacing={3} sx={{ justifyContent: 'center', paddingTop: '25px', paddingBottom: '25px', minHeight: 'calc(100vh - 52px)' }}>
        <Grid item xs={12} sm={2.75}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Paid Options" sx={{ textAlign: 'center' }}/>
                        <Divider/>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={5}><FormControlLabel control={<Checkbox onChange={(e) => setWelkin(e.target.checked)}/>} label="Welkin?"/></Grid>
                                <Grid item xs={7}><TextField label='Days of Welkin Left' disabled={!welkinCheck} type='number' onChange={(e) => {
                                    e.target.value = sanitizeWelkinInput(e.target.value).toString()
                                    setWelkinDays(parseInt(e.target.value))
                                }}/></Grid>
                                <Grid item xs={5}><FormControlLabel control={<Checkbox onChange={(e) => setBp(e.target.checked)}/>} label="Paid BP?"/></Grid>
                                <Grid item xs={7}><TextField label='Current BP Level' disabled={!bpCheck} type={'number'} onChange={(e) => {
                                    e.target.value = sanitizeBPInput(e.target.value).toString()
                                    setBpLvl(parseInt(e.target.value))
                                }}/></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{textAlign: 'center'}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography padding='16px' paddingBottom='12px'>Expected Primogems: {Math.floor(expectedPrimos)} <Primogem/> ({Math.floor(expectedPrimos/160)} pulls)</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography padding='16px' paddingTop='0px' fontSize='0.8rem'>This doesn't count quests or exploration, unless they're part of events like Golden Apple and Three Realms</Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={1.5}>
            <Card>
                <CardHeader title={"Abyss"} sx={{ textAlign: 'center' }}/>
                <Divider/>
                <CardContent sx={{ display: 'grid', rowGap: '1ch' }}>
                    <StarTextField label='Floor 9' onChange={(e) => onAbyssChange(e, 0)}/>
                    <StarTextField label='Floor 10' onChange={(e) => onAbyssChange(e, 1)}/>
                    <StarTextField label='Floor 11' onChange={(e) => onAbyssChange(e, 2)}/>
                    <StarTextField label='Floor 12' onChange={(e) => onAbyssChange(e, 3)}/>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Card sx={{justifyContent: 'center'}}>
                <CardHeader title={"End Date"} sx={{ textAlign: 'center' }}/>
                
                <Box maxWidth='95%' marginLeft='auto' marginRight='auto'>
                    <Calendar
                        onMonthChange={(() => updateLegend())}
                        onDateClick={(value: Date) => setDay(value)}
                    />
                </Box>

                <Grid container>
                    <Grid item xs={6}>
                        <Box sx={{ borderRadius: 1, margin: '1em', textAlign: 'center', backgroundColor: '#002c78', paddingBottom: '10px' }} className='react-calendar__tile newBanner'>New Banner</Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ borderRadius: 1, margin: '1em', textAlign: 'center', backgroundColor: '#14420a', paddingBottom: '10px' }} className='react-calendar__tile abyssReset'>Abyss Reset</Box>
                    </Grid>
                    {
                        Object.entries(Events).map(event => {
                            return <Grid item xs={12} sx={{ paddingBottom: '2px' }} id={`${event[0]}-legend`}>
                                <Box sx={{ height: '1.5em', width: '75%', backgroundColor: event[1].color, textAlign: 'center', margin: 'auto', borderRadius: '1em' }}>
                                    {event[1].name}
                                </Box>
                            </Grid>
                        })
                    }
                    {
                        hasEstimated ? <Grid item xs={12}><Typography textAlign='center' fontSize='0.7rem'>Unfinished main events use the average amount of primos from previous patches</Typography></Grid> : null
                    }
                    {
                        hasUnknownEvent ? <Grid item xs={12}><Typography textAlign='center' fontSize='0.7rem'>Undated events are placed on the end of patches for simplicity</Typography></Grid> : null
                    }
                </Grid>
                <Box height={'1em'}></Box>
            </Card>
        </Grid>
        {/* <Grid item xs={11.5}>
            <Card sx={{ justifyContent: 'center' }}>
                <CardHeader title={"Events"} sx={{ textAlign: 'center' }}/>
                <Events/>
            </Card>
        </Grid> */}
        
    </Grid>
}

export default App