import { Box, BoxProps, styled } from '@mui/material'
import Events from '../../Assets/events.json'
import Cal, { CalendarProps } from 'react-calendar'
import './Calendar.scss'
import { useEffect, useState } from 'react'
import { DateTime, Interval } from 'luxon'

type EventStripProp = BoxProps & {
    color: string,
    h: number
}

type CalProps = CalendarProps & {
    onMonthChange: () => number
    onDateClick: (value: DateTime) => void
}

export const DATE_3_0 = DateTime.utc(2022, 8, 24)
export const DATE_3_3 = DateTime.utc(2022, 12, 7)
export const INTERVAL_30_33 = Interval.fromDateTimes(DATE_3_0, DATE_3_3)

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

export function deltaDay(d1: DateTime, d2: DateTime): number {
    return Math.floor(d2.diff(d1, 'days').days)
}

export function get_now_utc(): DateTime {
    const today = DateTime.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    return today
}

export function get_now_local(): DateTime {
    const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    return today
}

function get_tommorrow(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
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
            const dateObject = DateTime.utc(date.getFullYear(), date.getMonth()+1, date.getDate())

            if (date.getDate() === 1 || date.getDate() === 16) {
                res.push('abyssReset')
            }
            
            // Check if it's in the new schedule
            if (INTERVAL_30_33.contains(dateObject)) {
                // New schedule
                if (deltaDay(DATE_3_0, dateObject) % 35 === 0) {
                    res.push('newPatch')
                } else if (deltaDay(DATE_3_0, dateObject) % 35 === 16) {
                    res.push('newBanner')
                }
            } else {
                // Not new schedule
                if (deltaDay(dateObject, DATE_3_3) % 42 === 0) {
                    res.push('newPatch')
                } else if (deltaDay(dateObject, DATE_3_3) % 21 === 0) {
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
            const utc = DateTime.local(value.getFullYear(), value.getMonth()+1, value.getDate())
            onDateClick(utc)
        }}
        defaultValue={get_tommorrow()}
        tileContent={({ date, activeStartDate }) => {
        return <Box height={`${15 + tileHeight}px`} width={'100%'} minHeight={"25px"}> 
            {
                Object.entries(Events).map((event, index) => {
                    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
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
                        if (utcDate < get_now_utc().toMillis()) {
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