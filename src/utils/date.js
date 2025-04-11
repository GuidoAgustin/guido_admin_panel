import moment from 'moment'

export function parseToDate(date, isDateTime) {
  if (!date) return null

  if (date instanceof moment) {
    if (!isDateTime) return date.clone().startOf('day').toDate()

    return date.toDate()
  }

  if (typeof date === 'string') {
    const dateReg = /^\d{4}-\d{2}-\d{2}$/ // Regex for YYYY-MM-DD
    const dateRegLatin = /^\d{2}-\d{2}-\d{4}$/ // Regex for DD-MM-YYYY
    const dateTime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/ // Regex for YYYY-MM-DD HH:mm
    const dateTimeLatin = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/ // Regex for DD-MM-YYYY HH:mm

    if (date.match(dateReg)) {
      return moment(date).startOf('day').toDate()
    }
    if (date.match(dateRegLatin)) {
      return moment(date, 'DD-MM-YYYY').startOf('day').toDate()
    }
    if (date.match(dateTime)) {
      return moment(date, 'DD-MM-YYYY HH:mm').toDate()
    }
    if (date.match(dateTimeLatin)) {
      return moment(date, 'DD-MM-YYYY HH:mm').toDate()
    }
    return moment(date).toDate()
  }

  return date
}
export function parseToString(date, isDateTime) {
  if (!date) return null

  if (!isDateTime) return moment(date).format('YYYY-MM-DD')

  return moment(date).format('YYYY-MM-DD HH:mm')
}
export function isToday(date) {
  if (!date) return false

  const d = moment(date)
  const startOfToday = moment().startOf('day')
  const endOfToday = moment().endOf('day')

  return d.isBetween(startOfToday, endOfToday)
}
export function parseToLocale(date, isDateTime) {
  if (!date) return null

  if (!isDateTime) return moment(date).format('MMM DD, YYYY')

  return moment(date).format('HH:mm - MMM DD, YYYY')
}
