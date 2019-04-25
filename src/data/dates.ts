import { Data } from 'types/data'

const getDayLabel = (date: Date): string => {
  if (!date) return ''
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const yearsWithData: number[] = [2017]

// const years = yearsWithData.map((year) => {
//   const date = new Date(Date.UTC(year))
//   return { id: date.toISOString(), label: `${date.getFullYear()}` }
// })

// const months = yearsWithData.flatMap((year) => {
//   return Array.from(Array(12).keys()).reduce((acc, month) => {
//     const date = new Date(Date.UTC(year, month))
//     acc.push({ id: date.toISOString(), label: `${date.getFullYear()}/${date.getMonth() + 1}` })
//     return acc
//   }, [])
// })

export const days: Data[] = yearsWithData.flatMap((year) => {
  return Array.from(Array(12).keys()).reduce((monthsAccumulate: Data[], month) => {
    //Day 0 is the last day in the previous month
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getDate()
    const daysOfMonth = Array.from(Array(daysInMonth).keys()).reduce(
      (daysAccumulate: Data[], day: number) => {
        const date = new Date(Date.UTC(year, month, day + 1))
        daysAccumulate.push({
          id: date.toISOString(),
          label: getDayLabel(date),
        })
        return daysAccumulate
      },
      []
    )
    return [...monthsAccumulate, ...daysOfMonth]
  }, [])
})

const lastYearDate: Date = new Date(Date.UTC(yearsWithData[yearsWithData.length - 1] + 1, 0))
export const lastDate: Data = {
  id: lastYearDate.toISOString(),
  label: getDayLabel(lastYearDate),
}
