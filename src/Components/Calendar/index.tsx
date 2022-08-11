import { Box, BoxProps, styled } from '@mui/material'
import Events from '../../Assets/events.json'
import Cal, { CalendarProps } from 'react-calendar'
import './Calendar.scss'
import { useEffect, useState } from 'react'

type EventStripProp = BoxProps & {
    color: string,
    h: number
}

type CalProps = CalendarProps & {
    onMonthChange: () => number
    onDateClick: (value: Date) => void
}

const DATE_2_8 = newDate(2022, 7, 13)
const DATE_2_7 = newDate(2022, 5, 31)

const EventStrip = styled(Box)<EventStripProp>(({ color, h }: EventStripProp) => ({
    height: '10px',
    width: '100%',
    marginLeft:'00%',
    marginTop: '0.1px',
    bottom: `${h*10}px`,
    backgroundColor: color,
    position: 'absolute',
    opacity: 1
}));

export function to_utc(d: Date) {
    let utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return new Date(utc)
}

export function get_now() {
    return to_utc(new Date())
}

function get_tom() {
    let tom = get_now()
    tom.setDate(tom.getDate() + 1)
    return tom
}

function deltaDate(d1: Date, d2: Date) {
    return d1.getTime() - d2.getTime()
}

function newDate(year: number, month: number, day: number) {
    return new Date(year, month-1, day)
}

let eventHeight: {[key: string]: number} = {}
export default function Calendar({ onMonthChange, onDateClick }: CalProps) {
    const [tileHeight, setTileHeight] = useState(0)

    useEffect(() => {
        const visibleEvents = onMonthChange()
        setTileHeight(visibleEvents)
    })

    return <Cal
        minDetail='month'
        minDate={new Date()}
        tileClassName={({ date }) => {
            let res:string[] = []

            if (date.getDate() === 1 || date.getDate() === 16){
                res.push('abyssReset')
            }

            if (deltaDate(date, DATE_2_8)/(24*60*60*1000) % 21 === 0) // Use start of 2.8
            {
                if (deltaDate(date, DATE_2_8)/(24*60*60*1000) % 42 === 0 || deltaDate(date, DATE_2_7) === 0) {
                    console.log(date)
                    res.push('newPatch')
                } else {
                    res.push('newBanner')
                }
                
            }

            return res
        }}
        onActiveStartDateChange={() => {
            const visibleEvents = onMonthChange()
            setTileHeight(visibleEvents)
        }}
        onClickDay={( value ) => {
            const utc = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
            onDateClick(utc)
        }}
        defaultValue={get_tom()}
        tileContent={({ date, activeStartDate }) => {
        return <Box height={`${15 + tileHeight}px`} width={'100%'} minHeight={"25px"}> 
            {
                Object.entries(Events).map((event, index) => {
                    const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1);
                    const eventStart = (new Date(event[1].start)).valueOf()
                    const eventEnd = (new Date(event[1].end)).valueOf()
                    
                    if (!(event[0] in eventHeight)) {
                        let incompatibleLanes: boolean[] = []

                        Object.entries(Events).forEach(e => {

                            if ((eventStart <= new Date(e[1].end).valueOf() && eventStart >= new Date(e[1].start).valueOf()) ||
                                (eventEnd >= new Date(e[1].start).valueOf() && eventEnd <= new Date(e[1].end).valueOf()) &&
                                (event[0] !== e[0])) {
                                
                                if (e[0] in eventHeight) {
                                    incompatibleLanes[eventHeight[e[0]]] = true
                                }
                            }
                        })

                        if (incompatibleLanes.length > 0) {
                            for (let i = 0; i < incompatibleLanes.length; i++) {
                                if (!incompatibleLanes[i]) {
                                    eventHeight[event[0]] = i
                                    break
                                }
                            }

                            // Go 1 above
                            if (eventHeight[event[0]] === index && incompatibleLanes[index]) {
                                eventHeight[event[0]] = incompatibleLanes.length
                            }
                        } else {
                            eventHeight[event[0]] = 0
                        }
                        if (eventHeight[event[0]] === undefined) {
                            eventHeight[event[0]] = incompatibleLanes.length
                        }
                    }

                    let height = eventHeight[event[0]]
                    if (utcDate >= eventStart && utcDate <= eventEnd) {
                        if (utcDate < get_now().valueOf()) {
                            return <EventStrip color={event[1].color} h={height} sx={{filter: 'brightness(0.6)'}} className={`${event[0]}-tag`}/>
                        } else if (date.getMonth() !== activeStartDate.getMonth()) {
                            return <EventStrip color={event[1].color} h={height} sx={{filter: 'brightness(0.8)'}} className={`${event[0]}-tag`}/>
                        }

                        return <EventStrip color={event[1].color} h={height} className={`${event[0]}-tag`}/>
                    }

                    return null
                })
            }
        </Box>
        }}
    />
}