import dayjs from 'dayjs'

export const START = dayjs(new Date(2017, 0, 1))
export const END = dayjs(new Date(2017, 11, 31))

const generateMock = () => {
  const CONFIG = {
    rfmo: {
      duration: [1, 100, 'day'],
    },
    event: {
      duration: [10, 300, 'hour'],
      interval: [0, 25, 'day'],
    },
  }
  const allData = {}
  Object.keys(CONFIG).forEach((key) => {
    const conf = CONFIG[key]
    const durationRange = conf.duration[1] - conf.duration[0]
    const intervalRange = conf.interval ? conf.interval[1] - conf.interval[0] : null
    const data = []
    let id = 0
    while (true) {
      const last = data.length ? data[data.length - 1] : null
      const duration = conf.duration[0] + Math.random() * durationRange
      const init = last ? last.end.clone() : START.clone()
      let start = init
      if (conf.interval) {
        const interval = conf.interval[0] + Math.random() * intervalRange
        start = start.add(interval, conf.interval[2])
      }
      let end = start.add(duration, conf.duration[2])
      const event = {
        id,
        start,
        end,
      }
      if (end.isAfter(END)) {
        event.end = END.clone()
        data.push(event)
        break
      }
      data.push(event)
      id++
    }
    allData[key] = data
  })

  allData.event = allData.event.map((event) => ({
    ...event,
    encounteredVessel: Math.random() > 0.5 ? null : `other:${event.id}`,
  }))

  return allData
}

export default generateMock()
