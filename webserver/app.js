
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var cors = require('cors') // for cross browser ajax allow setting
var app = express()

// express setting
app.use(favicon(path.join(__dirname, '../client/public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../client/public')))
app.use(cors()) // 브라우져에서 ajax 호출 허용. blank일때 어떤 도메인에서 ajax 호출해도 다 허용. it means '*'

// Route setting
// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middlewares/validateRequest')])
app.all('/*', require('./routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
// error handler
app.use(function (err, req, res, next) { // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  // send the error message
  res.send('Error: ' + err.message + '<br>' + err.status + '<br>' + err.stack)
})

module.exports = app
