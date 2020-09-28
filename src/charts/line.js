import { noYearDateStr, timeStr, timeMinuteStr } from '@/utils/dateTime.js'
import { formatMB, formatRate, formatNum } from '@/utils/assist.js'

export default function lineOption (data) {
  data = data || {}
  let option = { // 创建图表配置数据
    color: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
    // ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
    // ['#56ABD5', '#ED561B', '#008080', '#50B432', '#48619E', '#9BCD04', '#ffcc00'],
    title: {
      text: data.title,
      textStyle: {
        color: '#3a3a3a',
        fontSize: 14
      },
      left: 'center'
    },
    unit: data.unit,
    tooltip: {
      trigger: 'axis',
      enterable: true,
      confine: true,
      formatter: function (params) {
        const time = params[0].value[0]
        console.log(time)
        let str = noYearDateStr(time) + ' ' + timeStr(time) + '<br/>'
        let first = false
        params = params.sort((a, b) => {
          return b.value[1] - a.value[1]
        })
        params.forEach((item, index) => {
          if (first && item.seriesName.indexOf('series') >= 0) {
            return
          }
          let val
          switch (option.unit) {
            case 'byte':
              val = formatMB(item.value[1], true)
              break
            case 'rate':
              val = formatRate(item.value[1])
              break
            case 'time':
              val = item.value[1]
              break
            default:
              val = formatNum(item.value[1])
          }
          first = true
          str += item.marker + (item.seriesName.indexOf('series') >= 0 ? '' : (item.seriesName + ': ')) + val + '<br/>'
        })
        return str
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: function (value, index) {
          return noYearDateStr(value) + ' ' + timeMinuteStr(value)
        }
      }
    },
    yAxis: {
      name: data.yAxisTitle || '',
      type: 'value',
      axisLabel: {
        formatter: function (value, index) {
          switch (data.unit) {
            case 'byte':
              return formatMB(value)
            case 'rate':
              return formatRate(value)
            case 'time':
              return value
            default:
              return formatNum(value)
          }
        }
      },
      min: function (value) {
        if (data.unit === 'rate') { return 0 }
        if (value.min === Infinity || value.min < 1024) { return 0 }
        if (value.min > 1024 && value.min < 1024 * 1024) { return 1024 }
        if (value.min > 1024 * 1024 && value.min < 1024 * 1024 * 1024) {
          return Math.floor(value.min / (1024 * 1024)) * 1024 * 1024
        }
        if (value.min > 1024 * 1024 * 1024) {
          return Math.floor(value.min / (1024 * 1024 * 1024)) * 1024 * 1024 * 1024
        }
      },
      max: function (value) {
        return data.unit === 'rate' ? 100 : (value.max > 10 ? value.max : 10)
      }
    },
    grid: {
      top: 40,
      left: 85,
      right: 40,
      bottom: 30
    },
    noDataLoadingOption: {
      effect: 'bubble',
      text: '暂无数据',
      effectOption: {
        effect: {
          n: 0
        }
      },
      textStyle: {
        fontSize: 32,
        fontWeight: 'bold'
      }
    }
  }
  return option
}
