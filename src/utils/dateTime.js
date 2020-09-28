/**
 * @param Str
 * @constructor
 */
export function getDateObj (time) {
  let now
  if (time) {
    now = new Date(time)
  } else {
    now = new Date()
  }
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    milli: now.getMilliseconds()
  }
}
export function dateStr (time, split) {
  split = split || '-'
  let obj = getDateObj(time)
  let month = obj.month + 1 < 10 ? '0' + (obj.month + 1) : (obj.month + 1)
  let date = obj.date < 10 ? '0' + obj.date : obj.date
  return obj.year + split + month + split + date
}
export function noMinutesDateStr (time, split) {
  split = split || '/'
  let obj = getDateObj(time)
  let month = obj.month + 1 < 10 ? '0' + (obj.month + 1) : (obj.month + 1)
  let date = obj.date < 10 ? '0' + obj.date : obj.date
  let hours = obj.hours < 10 ? '0' + obj.hours : obj.hours
  let minutes = obj.minutes < 10 ? '0' + obj.minutes : obj.minutes
  return obj.year + split + month + split + date + ' ' + hours + ':' + minutes + ':00'
}
export function noYearDateStr (time, split) {
  split = split || '/'
  let obj = getDateObj(time)
  let month = obj.month + 1 < 10 ? '0' + (obj.month + 1) : (obj.month + 1)
  let date = obj.date < 10 ? '0' + obj.date : obj.date
  return month + split + date
}
export function timeStr (time, split) {
  split = split || ':'
  let obj = getDateObj(time)
  let hours = obj.hours < 10 ? '0' + obj.hours : obj.hours
  let minutes = obj.minutes < 10 ? '0' + obj.minutes : obj.minutes
  let seconds = obj.seconds < 10 ? '0' + obj.seconds : obj.seconds
  return hours + split + minutes + split + seconds
}

export function timeMinuteStr (time, split) {
  split = split || ':'
  let obj = getDateObj(time)
  let hours = obj.hours < 10 ? '0' + obj.hours : obj.hours
  let minutes = obj.minutes < 10 ? '0' + obj.minutes : obj.minutes
  return hours + split + minutes
}

export function timeMilliStr (time, split) {
  split = split || ':'
  let obj = getDateObj(time)
  let hours = obj.hours < 10 ? '0' + obj.hours : obj.hours
  let minutes = obj.minutes < 10 ? '0' + obj.minutes : obj.minutes
  let seconds = obj.seconds < 10 ? '0' + obj.seconds : obj.seconds
  let milli = obj.milli < 10 ? ('00' + obj.milli)
    : obj.milli < 100 ? ('0' + obj.milli) : obj.milli
  return hours + split + minutes + split + seconds + split + milli
}

export function getPrevious (time, prevMilliseconds) {
  return new Date(time - prevMilliseconds).getTime()
}
export function getTodayStart () {
  let obj = getDateObj()
  return new Date(obj.year, obj.month, obj.date).getTime()
}
export function getYesterDayStart () {
  let obj = getDateObj()
  return new Date(obj.year, obj.month, obj.date - 1).getTime()
}
export function getPrevYesterDayStart () {
  let obj = getDateObj()
  return new Date(obj.year, obj.month, obj.date - 2).getTime()
}

export function getPrevDayStart (num) {
  let obj = getDateObj()
  return new Date(obj.year, obj.month, obj.date - num).getTime()
}

export function getPrevDayFromTime (time, num) {
  let obj = getDateObj(time)
  return new Date(obj.year, obj.month, obj.date - num).getTime()
}

export function getPrevMonthFromTime (time, num) {
  let obj = getDateObj(time)
  return new Date(obj.year, obj.month - num, obj.date).getTime()
}
