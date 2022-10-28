import { CardContent, Divider, TextField, Grid, FormControlLabel, Checkbox, CardHeader, Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Card from './Components/Card'
import Calendar, { get_now_local, deltaDay, INTERVAL_30_33 } from './Components/Calendar/'
import { DateTime, Interval } from 'luxon'
import Primogem from './Components/Primogem'
import StarTextField from './Components/StarTextField'
import Events from './Assets/events.json'
//import Events from './Components/Events'
import './App.css'

const DAY_IN_MS = 86400000

class MapZeroDefault extends Map<string, number> {
    get(key: string) {
        if (!this.has(key)) {
            this.set(key, 0)
        }

        return (super.get(key) || 0)
    }

    inc(key: string, val: number) {
        super.set(key, this.get(key) + val)
    }
}

function App() {
    const today = get_now_local()
    const [bpCheck, setBp] = React.useState(false)
    const [welkinCheck, setWelkin] = React.useState(false)
    const [expectedPrimos, setExpectedPrimos] = React.useState(0)
    const [currentPrimos, setCurrentPrimos] = React.useState(0)
    const [welkinDays, setWelkinDays] = React.useState(0)
    const [bpLvl, setBpLvl] = React.useState(0)
    const [hasUndatedEvent, setUndatedEvent] = React.useState(false)
    const [hasEstimated, setEstimated] = React.useState(false)
    const [abyssFloors, setAbyssFloors] = React.useState([0, 0, 0, 0])
    const [primoSources, setPrimoSources] = React.useState(new MapZeroDefault())
    const [day, setDay] = React.useState(today.plus({ days: 1 }))

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
        let undatedEvent = false
        let estimated = false

        Object.entries(Events).forEach(event => {
            const tags = document.getElementsByClassName(`${event[0]}-tag`)
    
            if (tags.length > 0) {
                if (event[1].hasOwnProperty('estimated')) { estimated = true }
                if (event[1].hasOwnProperty('undated')) { undatedEvent = true }
                if (tags.item(0)) {
                    eventsCount[event[0]] = [tags.length, (getHeight(tags.item(0)))]
                }
            } else {
                eventsCount[event[0]] = [0, 0]
            }
        })

        setUndatedEvent(undatedEvent)
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

    interface Event {
        start: string
        end: string
        interval: Interval
        name: string
        color: string
        primos: number | number[]
        duration?: number
        rushable?: boolean
        average?: boolean
    }

    // Calc primos
    useEffect(() => {
        let checkDay = today.plus({ days: 1 })
        let welkinDaysLeft = welkinDays
        let currentBPLvl = bpLvl
        let expected = 0
        let sources = new MapZeroDefault()

        const increment = (key: string, val: number) => {
            expected += val
            sources.inc(key, val)
        }
        const abyssStars = abyssFloors.reduce((a, b) => a+b)

        let events = [...Object.entries(Events).map(e => {
            const event = {...e[1], interval: Interval.fromDateTimes(DateTime.fromISO(e[1].start), DateTime.fromISO(e[1].end).plus({ millisecond: 1 }))} as Event
            return event
        })]

        console.log(checkDay.toISODate(), day.toISODate())
        while (deltaDay(checkDay, day) >= 0) {
            increment('Daily', 60)

            // Welkin
            if (welkinDaysLeft > 0 && welkinCheck) {
                welkinDaysLeft--    
                increment('Welkin', 90)
            }

            // Abyss
            if (checkDay.day === 1 || checkDay.day === 16) {
                increment('Abyss', 50 * Math.floor(abyssStars/3))
            }

            // BP
            if (checkDay.weekday === 7 && bpCheck) {
                if (currentBPLvl < 40) {
                    increment('Battle Pass', 160)
                    currentBPLvl += 10
                } else if (currentBPLvl < 50) {
                    increment('Battle Pass', 680)
                    currentBPLvl += 10
                }
            }

            // Paimon's Bargains
            if (checkDay.day === 1) {
                increment("Paimon's Bargains", 800)
            }

            // Reset BP Level & add Maintenance Compensation
            const utc_day = DateTime.utc(checkDay.year, checkDay.month, checkDay.day)
            if (INTERVAL_30_33.contains(checkDay)) {
                if (deltaDay(utc_day, INTERVAL_30_33.start) % 35 === 0) {
                    console.log(utc_day.toISODate())
                    increment('Maintenance Compensation', 600)
                    currentBPLvl = 0
                }
            } else {
                if (deltaDay(utc_day, INTERVAL_30_33.end) % 42 === 0) {
                    increment('Maintenance Compensation', 600)
                    currentBPLvl = 0
                }
            }

            // Events
            events.forEach(e => {
                if (e.interval.contains(checkDay)) {
                    if (typeof e.primos === 'number') {
                        if (e.rushable && checkDay.equals(e.interval.start)) {
                            increment(e.name, e.primos)
                            return
                        }

                        if (e.duration) {
                            if (deltaDay(e.interval.start, checkDay) < e.duration) {
                                increment(e.name, e.primos/e.duration)
                                return
                            }
                        }

                        if (e.average) {
                            console.log(Math.floor(e.interval.length('days')))
                            increment(e.name, e.primos/Math.floor(e.interval.length('days')+1))
                            return
                        }
                    } else if (typeof e.primos === 'object') {
                        const eventDay = deltaDay(e.interval.start, checkDay)

                        if (e.primos.length-1 >= eventDay) {
                            console.log(e.primos[eventDay], e.primos.length, eventDay)
                            increment(e.name, e.primos[eventDay])
                        }
                    }
                }
            })
            
            checkDay = checkDay.plus({ days: 1 })
        }

        sources = new MapZeroDefault(
            Array
              .from(sources)
              .sort((a, b) => {
                // a[0], b[0] is the key of the map
                return b[1] - a[1];
              })
          )
        setExpectedPrimos(expected + (currentPrimos || 0))
        setPrimoSources(sources)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welkinDays, bpLvl, day, abyssFloors, bpCheck, welkinCheck, currentPrimos]) 

    // Initiate legends
    useEffect(() => {
        updateLegend()
    })

    return <Grid container spacing={3} sx={{ justifyContent: 'center', paddingTop: '25px', paddingBottom: '25px', minHeight: 'calc(100vh - 52px)' }}>
        <Grid item xs={12} sm={2.75+1.5}>
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12} sm={6}> {/* Options */}
                    <Card>
                        <CardHeader title="Options" sx={{ textAlign: 'center' }}/>
                        <Divider/>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><TextField label='Current Primogems' type={'number'} onChange={(e) => {
                                    e.target.value = sanitizeNumberInput(e.target.value).toString()
                                    setCurrentPrimos(parseInt(e.target.value))
                                }} sx={{ textAlign: 'center' }} fullWidth/></Grid>
                                <Grid item xs={5}><FormControlLabel control={<Checkbox onChange={(e) => setWelkin(e.target.checked)}/>} label="Welkin?"/></Grid>
                                <Grid item xs={7}><TextField label='Days of Welkin Left' disabled={!welkinCheck} type='number' onChange={(e) => {
                                    e.target.value = sanitizeWelkinInput(e.target.value).toString()
                                    setWelkinDays(parseInt(e.target.value))
                                }} fullWidth/></Grid>
                                <Grid item xs={5}><FormControlLabel control={<Checkbox onChange={(e) => setBp(e.target.checked)}/>} label="Paid BP?"/></Grid>
                                <Grid item xs={7}><TextField label='Current BP Level' disabled={!bpCheck} type={'number'} onChange={(e) => {
                                    e.target.value = sanitizeBPInput(e.target.value).toString()
                                    setBpLvl(parseInt(e.target.value))
                                }} fullWidth/></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}> {/* Abyss */}
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
                <Grid item xs={12}> {/* Expected Primogems */}
                    <Card sx={{textAlign: 'center'}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography padding='16px' paddingBottom='12px'>Estimated Primogems: {Math.floor(expectedPrimos)} <Primogem/> ({Math.floor(expectedPrimos/160)} pulls)</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography padding='16px' paddingTop='0px' paddingBottom='0px' fontSize='0.8rem'>This doesn't count quests or exploration, unless they're part of events like Golden Apple and Three Realms.</Typography>
                                <Typography padding='16px' paddingTop='0px' fontSize='0.8rem'>Assumes you do the event right away.</Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {expectedPrimos > 0 ? <Grid item xs={12}> {/* Sources */}
                    <Card sx={{ justifyContent: 'center' }}>
                        <CardHeader title={"Sources"} sx={{ textAlign: 'center' }}/>
                        <Divider/>
                        <Grid container spacing={0.5} justifyContent='space-between' paddingLeft='20px' paddingRight='20px' marginTop='0.5em' marginBottom='0.7em'>
                            {
                                Array.from(primoSources).map(([key, value]) => {
                                    if (value > 0){
                                        return [<Grid item xs={9}>{key}</Grid>, <Grid item xs='auto'>{Math.floor(value)} <Primogem/></Grid>]
                                    }
                                    return null
                                })
                            }
                        </Grid>
                    </Card>
                </Grid> : null}
            </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{justifyContent: 'center'}}>
                        <CardHeader title={"End Date"} sx={{ textAlign: 'center' }}/>
                        
                        <Box maxWidth='95%' marginLeft='auto' marginRight='auto'>
                            <Calendar
                                onMonthChange={(() => updateLegend())}
                                onDateClick={(value: DateTime) => {
                                        setDay(value)
                                    }
                                }
                            />
                        </Box>

                        <Grid container>
                            <Grid item xs={4}>
                                <Box sx={{ borderRadius: 1, margin: '0.5em', marginBottom: '1em', textAlign: 'center', backgroundColor: '#002c78', paddingBottom: '10px' }} className='react-calendar__tile newBanner'>New Banner</Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ borderRadius: 1, margin: '0.5em', marginBottom: '1em', textAlign: 'center', backgroundColor: '#881ed4', paddingBottom: '10px' }} className='react-calendar__tile newPatch'>New Patch</Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ borderRadius: 1, margin: '0.5em', marginBottom: '1em', textAlign: 'center', backgroundColor: '#14420a', paddingBottom: '10px' }} className='react-calendar__tile abyssReset'>Abyss Reset</Box>
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
                                hasUndatedEvent ? <Grid item xs={12}><Typography textAlign='center' fontSize='0.7rem'>Undated events are placed on the end of patches for simplicity</Typography></Grid> : null
                            }
                        </Grid>
                        <Box height={'1em'}></Box>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}

export default App