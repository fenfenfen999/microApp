// url统一存放
export default {
  backsize: 0,
  cityExp: /^\/([a-zA-Z-]+)\//,
  mailExp: /^[a-zA-Z]+\d*@jd\.com$/,
  IDIPExp: /(^\d+)((,|，)\d+)*$|(^\d+\.\d+\.\d+\.\d+)((,|，)\d+\.\d+\.\d+\.\d+)*$/,
  telExp: /^\d{11}$/,
  positiveNumExp: /^[1-9]+[0-9]*$/,
  numExp: /^(-|\+)?\d+$/
}
