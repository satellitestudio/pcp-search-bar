import React, { Fragment, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { scaleTime } from 'd3-scale'
import { debounce } from 'lodash'
import cx from 'classnames'
import './timeline.css'
import { START, END } from 'data/events-history'

const COLUMN_WIDTH = 10

let isRAFTicking = false

interface TimelineProps {
  events: object
  rfmos: object
  onChange?: (timestamp: number | null) => void
  onEventClick?: (timestamp: number | null) => void
}

const Timeline: React.FC<TimelineProps> = React.memo(function Timeline({
  events,
  rfmos,
  onChange,
  onEventClick,
}) {
  // prepare coordinates (only be events prop changes, so that should mean only at mount)
  const computeCoordinates = (events: any, rfmos: any) => {
    const scale = scaleTime()
      .domain([START.toDate(), END.toDate()])
      .range([0, 1])

    const toNormalized = (date: any) => scale(date)
    const toCoord = (normalized: any) => `${normalized * 100}%`
    const computeCoordsForType = (items: any) => {
      return items.map((item: any) => {
        const startDate = item.start.toDate()
        const endDate = item.end.toDate()
        const startNormalized = toNormalized(startDate)
        const endNormalized = toNormalized(endDate)
        const heightNormalized = endNormalized - startNormalized
        const middleNormalized = startNormalized + heightNormalized / 2
        return {
          ...item,
          startNormalized,
          endNormalized,
          startCoord: toCoord(startNormalized),
          endCoord: toCoord(endNormalized),
          middleNormalized,
          middleCoord: toCoord(middleNormalized),
          height: toCoord(heightNormalized),
        }
      })
    }
    return {
      events: computeCoordsForType(events),
      rfmos: computeCoordsForType(rfmos),
    }
  }

  // Compute derived data when a new event is highlighted
  const computeScrollCoords = (timelineCoords: any, selected: any) => {
    const currentEvent = timelineCoords.events.find((e: any) => e.id === selected)
    const y = currentEvent ? currentEvent.middleCoord : 0
    const currentRfmo =
      currentEvent === undefined
        ? null
        : timelineCoords.rfmos.find((rfmo: any) => {
            if (
              currentEvent.middleNormalized > rfmo.startNormalized &&
              currentEvent.middleNormalized < rfmo.endNormalized
            ) {
              return true
            }
            return false
          })
    const currentRfmoId = currentRfmo ? currentRfmo.id : null
    return {
      y,
      currentRfmoId,
      currentEvent,
    }
  }

  // this stores DOM elements for events
  let eventRefs = useRef(new Map()).current

  // store currently highlighted/selected event in state
  const [selected, setSelected] = useState<number | null>(null)

  // selects an event depending on scroll position
  const checkScroll = useCallback(() => {
    isRAFTicking = false
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let minDelta = Number.POSITIVE_INFINITY
    let selectedEvent = null
    eventRefs.forEach((el, key) => {
      el.classList.toggle('selected', false)
      const { top } = el.getBoundingClientRect()

      const delta = Math.abs(middle - top)
      if (delta < minDelta) {
        selectedEvent = key
        minDelta = delta
      }
    })
    setSelected(selectedEvent)
  }, [eventRefs])

  const onScroll = useCallback(() => {
    if (isRAFTicking === false) {
      isRAFTicking = true
      // avoid scroll jank by throttling to frame
      window.requestAnimationFrame(checkScroll)
    }
  }, [checkScroll])

  const handleEventClick = useCallback(
    (event) => {
      const ref = eventRefs.get(event.id)
      if (ref) {
        ref.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        if (onEventClick !== undefined) {
          onEventClick(event.id)
        }
      }
    },
    [eventRefs, onEventClick]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [onScroll])

  useEffect(() => {
    onChange !== undefined && onChange(selected)
  }, [onChange, selected])

  const timelineCoords = useMemo(() => computeCoordinates(events, rfmos), [events, rfmos])
  const scrollCoords = useMemo(() => computeScrollCoords(timelineCoords, selected), [
    timelineCoords,
    selected,
  ])

  const [encounteredVessel, setEncounteredVessel] = useState(null)
  const loadEncounteredVessel = (currentEvent: any) => {
    // simulate fetch - should also cancel pending, if it exists
    setTimeout(() => setEncounteredVessel(currentEvent.encounteredVessel), 200)
  }
  const debouncedLoadEncounteredVessel = useRef(debounce(loadEncounteredVessel, 1000))
  useEffect(() => {
    setEncounteredVessel(null)
    debouncedLoadEncounteredVessel.current.cancel()
    if (selected !== null && scrollCoords.currentEvent.encounteredVessel !== null) {
      debouncedLoadEncounteredVessel.current(scrollCoords.currentEvent)
    }
  }, [selected, scrollCoords])
  const cH = document.documentElement.clientHeight
  const wH = window.innerHeight || 0
  const middle = Math.max(cH, wH) / 2

  return (
    <Fragment>
      <div
        style={{
          top: middle,
          position: 'fixed',
          zIndex: 10,
          width: 100,
          borderBottom: '1px solid red',
        }}
      />
      <div className="timeline">
        <svg>
          <g className="eventsColumn">
            {timelineCoords.events.map((event: any) => (
              <rect
                x={0}
                y={event.startCoord}
                key={event.id}
                width={COLUMN_WIDTH}
                height={event.height}
                className={cx({ highlighted: event.id === selected })}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </g>
          <g className="rfmosColumn">
            {timelineCoords.rfmos.map((rfmo: any) => (
              <rect
                x={0}
                y={rfmo.startCoord}
                key={rfmo.id}
                width={COLUMN_WIDTH}
                height={rfmo.height}
                className={cx({ highlighted: rfmo.id === scrollCoords.currentRfmoId })}
              />
            ))}
          </g>
          <line
            x1="0%"
            x2="100%"
            style={{
              transform: `translateY(${scrollCoords.y})`,
            }}
          />
        </svg>
      </div>
      <div className="detail">
        {timelineCoords.events.map((event: any) => {
          const highlighted = event.id === selected
          return (
            <div
              ref={(inst) =>
                inst === null ? eventRefs.delete(event.id) : eventRefs.set(event.id, inst)
              }
              className={cx('event', { highlighted })}
              key={event.id}
            >
              Event {event.id}
              <br />
              {event.encounteredVessel !== null && <div>I'm an encounter!</div>}
              {event.start.format('DD/MM/YYYY HH:mm')}
              <br />
              {event.end.format('DD/MM/YYYY HH:mm')}
              <br />
              {event.id === selected && encounteredVessel !== null && (
                <div className="encounteredVessel">{encounteredVessel}</div>
              )}
              {highlighted === true && (
                <ul>
                  <li>data 1</li>
                  <li>data 2</li>
                  <li>data 3</li>
                  <li>data 4</li>
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </Fragment>
  )
})

export default Timeline
