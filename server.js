const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const config = require('config-lite')(__dirname)
const path = require('path')
const util = require('util')
const cookieParser = require('cookie-parser')
const proxy = require('http-proxy-middleware')
const md5 = require('md5')
// 用户登录及权限
const Erp = require('./lib/erp.js')
// cors跨域
const cors = require('cors');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('*',(req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  next()
});

// Sessions
app.use(
  session({
    name: config.session.key,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: config.session.maxAge }
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'dist')))

// 判断是否Erp登录
// app.use(function (req, res, next) {
//   const baseUrl = 'http://' + req.headers.host
//   const redirectUrl = config.sso_redirect_url
//   try {
//     console.info('request url: ' + req.originalUrl)
//     console.info('session id:' + req.session.id)
//     const cookieName = config.sso_cookie_name
//     let ticket = req.cookies[cookieName] || ''
//     console.info(util.format('ticket：%s', ticket))
//
//     const _url = baseUrl.replace(/\/$/g, '') + req.originalUrl
//
//     const _app = 'webadmin'
//     const _token = '4b782464c884459bab4f72fb4726aedf'
//
//     // const _app = 'test3'
//     // const _token = '347c6161e79f4b6a8873202dd5fe7e8f'
//
//     const _time = new Date().getTime()
//
//     const md5Str = md5(_token + _time + ticket)
//
//     let _ip =
//       req.headers['x-forwarded-for'] ||
//       req.connection.remoteAddress ||
//       req.socket.remoteAddress ||
//       req.connection.socket.remoteAddress
//     if (!_ip || _ip.indexOf('::') > -1) _ip = '10.12.140.205'
//
//     if (ticket && ticket !== '') {
//       const _param = {
//         ticket: ticket,
//         url: _url,
//         ip: _ip,
//         app: _app,
//         token: _token,
//         time: _time,
//         sign: md5Str
//       }
//
//       const ssoVerifyUrl = config.sso_verify_ticket_url
//       Erp.getErp(ssoVerifyUrl, _param, function (err, result) {
//         if (err) {
//           console.error(
//             util.format('Erp verifyTicket [err: %s]', JSON.stringify(err))
//           )
//           if (req.originalUrl.indexOf('/api/') > -1) {
//             return res.json({
//               code: '401',
//               message: '登录校验失败'
//             })
//           }
//           const url = redirectUrl + encodeURIComponent(baseUrl) + req.path
//           console.info(util.format('Erp verify failed, redirect to：%s', url))
//           res.redirect(url)
//         }
//         console.info(util.format('getErp [result: %s]', JSON.stringify(result)))
//         if (typeof result === 'string') {
//           result = JSON.parse(result)
//         }
//         if (typeof result === 'object' && result.REQ_CODE === 1) {
//           req.session.erp = result.REQ_DATA
//           console.info(util.format('Erp：%s, city: %s', JSON.stringify(req.session.erp), config.city))
//           req.session.cookies = req.cookies
//           console.info(
//             util.format('Cookies：%s', JSON.stringify(req.session.cookies))
//           )
//           next()
//         } else {
//           // 登录票据过期
//           req.session.erp = null
//           req.session.cookies = null
//           if (req.originalUrl.indexOf('/api/') > -1) {
//             return res.json({
//               code: '401',
//               message: '登录票据过期'
//             })
//           }
//           const url = redirectUrl + encodeURIComponent(baseUrl) + req.path
//           console.info(util.format('Login ticket expired, redirect to：%s', url))
//           res.redirect(url)
//         }
//       })
//     } else {
//       req.session.erp = null
//       req.session.cookies = null
//       if (req.originalUrl.indexOf('/api/') > -1) {
//         return res.json({
//           code: '401',
//           message: '检测到未登录'
//         })
//       }
//       const url = redirectUrl + encodeURIComponent(baseUrl) + req.path
//       console.info(util.format('Not login, redirect to：%s', url))
//       res.redirect(url)
//     }
//   } catch (err) {
//     console.error(
//       util.format('Erp parseTicket [err: %s]', JSON.stringify(err).toString())
//     )
//     const url = redirectUrl + encodeURIComponent(baseUrl) + req.path
//     console.info(util.format('Not login, redirect to：%s', url))
//     res.redirect(url)
//   }
// })

app.get('/jimdbApi/log/in', function (req, res, next) {
  res.json({
    erp: req.session.erp ? req.session.erp.username : '',
    city: config.city
  })
})

app.get('/jimdbApi/log/out', function (req, res, next) {
  // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
  // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
  // 然后去查找对应的 session 文件，报错
  // session-file-store 本身的bug
  // req.session[config.session.key] = null;
  req.session.destroy(function (err) {
    res.send({
      sso_redirect_url: config.sso_redirect_url
    })
  })
})

// sso的不同站点的ticket开头

const proxyOptionNg = {
  target: config.api_url_ng,
  changeOrigin: true,
  pathRewrite: {
    '^/jimdbApi/api/ng/': ''
  }
}

const proxyOptionCity = {
  target: config.api_url,
  changeOrigin: true,
  pathRewrite: {
    '^/jimdbApi/api': ''
  }
}

const proxyOption = {
  onProxyRes (proxyRes, req, res) {
    if (proxyRes.headers.location && proxyRes.headers.location.indexOf('ssa.jd.com') >= 0) {
      res.send({
        sso_redirect_url: config.sso_redirect_url
      })
    }
  }
}

// 反向代理

app.use('/jimdbApi/api/ng', proxy(Object.assign(proxyOption, proxyOptionNg)))

app.use('/jimdbApi/api', proxy(Object.assign(proxyOption, proxyOptionCity)))

app.use('/', indexRouter)

app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('index')
})

module.exports = app
