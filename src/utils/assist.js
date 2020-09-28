const Vue = require('vue')
const isServer = Vue.prototype.$isServer
/**
 * 常用方法
 */
const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

// 补白
export function paddingStr (str, pstr, num) {
  str = str + ''
  if (str.length < num) {
    for (let i = 0; i <= num - str.length; i++) {
      str = pstr + str
    }
  }
  return str
}

// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

// 判断是否是颜色
export function isColor (value) {
  const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/
  const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/
  const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/

  return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value)
}

/**
 * [camelCaseToHyphen 将驼峰命名转换为连字符]
 * @param  {[string]} str [驼峰命名的字符串]
 * @return {[string]}     [连字符的字符串]
 */
export function camelCaseToHyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function camelCase (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

// For Modal scrollBar hidden
let cached
export function getScrollBarSize (fresh) {
  if (isServer) return 0
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

export function getStyle (element, styleName) {
  if (!element || !styleName) return null

  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }

  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

function typeOf (obj) {
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[Object.prototype.toString.call(obj)]
}

export function deepCopy (data) {
  const type = typeOf(data)
  let obj

  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    return data
  }

  if (type === 'array') {
    for (let i = 0; i < data.length; i++) {
      obj.push(deepCopy(data[i]))
    }
  } else if (type === 'object') {
    for (const i in data) {
      obj[i] = deepCopy(data[i])
    }
  }

  return obj
}

export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  }
  return (` ${el.className} `).indexOf(` ${cls} `) > -1
}

export function addClass (el, cls) {
  if (!el) return

  const classes = (cls || '').split(' ')
  let curClass = el.className

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass (el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ` ${el.className} `

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }

  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }

  return parent
}

export function findComponentsUpward (context, componentName, components = []) {
  let parent = context.$parent
  let name = parent.$options.name

  while (parent && name) {
    if (componentName === name) {
      components.push(parent)
    }

    parent = parent.$parent
    if (parent) {
      name = parent.$options.name
    }
  }

  return components
}

export function findComponentDownward (context, componentName) {
  const childrens = context.$children
  let children

  if (childrens.length) {
    childrens.forEach(child => {
      if (child.$options.name === componentName) {
        children = child
      }
    })

    for (let i = 0, len = childrens.length; i < len; i++) {
      const child = childrens[i]
      const name = child.$options.name

      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }

  return children
}

export function findComponentsDownward (context, componentName, components = []) {
  const childrens = context.$children

  if (childrens.length) {
    childrens.forEach(child => {
      const subChildren = child.$children
      const name = child.$options.name

      if (name === componentName) {
        components.push(child)
      }
      if (subChildren.length) {
        const findChildren = findComponentsDownward(child, componentName, components)
        if (findChildren) {
          components.concat(findChildren)
        }
      }
    })
  }

  return components
}

// Find brothers components
export function findBrothersComponents (context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName
  })
  let index = res.findIndex(item => item._uid === context._uid)
  if (exceptMe) res.splice(index, 1)
  return res
}

export function getToDocT (el) {
  // let top = el.offsetTop;
  // while (el) {
  //   top += el.offsetTop;
  //   el = el.offsetParent;
  // }
  // return top;
  let rect = el.getBoundingClientRect()
  // 获取元素距离文档顶部的距离
  let top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
  return Math.floor(top)
}

export function getToDocL (el) {
  let rect = el.getBoundingClientRect()
  // 获取元素距离文档顶部的距离
  let left = rect.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
  return Math.floor(left)
}

// 数字转换
// 补白

export function formatMB (y, all) {
  if (y < 1024) {
    return y + 'B'
  } else if (y >= 1024 && y < 1024 * 1024) {
    if (all) {
      return y / 1024 + 'KB'
    } else {
      return (y / 1024).toFixed(2) + 'KB'
    }
  } else if (y >= 1024 * 1024 && y < 1024 * 1024 * 1024) {
    if (all) {
      return (y / (1024 * 1024)).toFixed(4) + 'MB'
    } else {
      return (y / (1024 * 1024)).toFixed(2) + 'MB'
    }
  } else {
    if (all) {
      return (y / (1024 * 1024 * 1024)).toFixed(8) + 'GB'
    } else {
      return (y / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }
  }
}

export function formatRate (y) {
  return y + '%'
}

export function formatNum (y) {
  if (y < 10000) {
    return y
  } else if (y >= 10000 && y < 10000000) {
    return y / 10000 + '万'
  } else if (y >= 10000000) {
    return y / 10000000 + '千万'
  }
}

export function Base64Encode (str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes (match, p1) {
    return String.fromCharCode('0x' + p1)
  }))
}

export function Base64Decode (str) {
  return decodeURIComponent(atob(str).split('').map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2) }).join(''))
}
