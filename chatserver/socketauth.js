var jwt = require('jwt-simple')
var userdb = require('./../models/User')

// var socketioAuth = require('socketio-auth')
// socketioAuth(io, {
//   authenticate: authenticate,
//   postAuthenticate: postAuthenticate,
//   disconnect: disconnect,
//   timeout: 1000
// })

module.exports = {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  disconnect: disconnect,
  timeout: 1000
}

// authenticate: The only required parameter. It's a function that takes the data sent by the client and calls a callback indicating if authentication was successfull:
function authenticate (socket, data, callback) {
  var decoded = jwt.decode(data.token, require('../config/secret.js')())
  if (decoded.exp <= Date.now()) callback(new Error('Token Expired'))

  userdb.findUser({email: decoded.email}, function (err, user) {
    if (err || !user) return callback(new Error('User not found'))
    return callback(null, user.email === decoded.email)
  })
}
// postAuthenticate: a function to be called after the client is authenticated. It's useful to keep track of the user associated with a client socket:
function postAuthenticate (socket, data) {
  var decoded = jwt.decode(data.token, require('../config/secret.js')())

  userdb.findUser({email: decoded.email}, function (err, user) {
    if (err) {
      console.log(err.stack)
    }
    socket.client.profile = decoded
  })
}
// disconnect: a function to be called after the client is disconnected.
function disconnect (socket) {
  console.log(socket.id + ' disconnected')
}
