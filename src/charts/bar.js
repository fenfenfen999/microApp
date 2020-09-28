export default function barOption (data) {
  data = data || {
    series: []
  }
  let option = { // 创建图表配置数据
    title: {
      text: data.title,
      left: 'center',
      y: 10
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '5%',
      top: 50,
      right: '2%',
      bottom: 120
    },
    xAxis: {
      type: 'category',
      data: data.legend,
      axisLabel: {
        interval: 0,
        rotate: 50, // 倾斜度 -90 至 90 默认为0
        textStyle: {
          fontSize: 10 // 让字体变大
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series: data.series
  }
  return option
}
