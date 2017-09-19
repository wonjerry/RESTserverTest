var socketio = require('socket.io')
// var User = require('../webserver/models/User')
// var RoomManager = require('./roommanager')

var socketioAuth = require('socketio-auth')
var authconfig = require('./socketauth')
socketioAuth(socketio, {
  authenticate: authconfig.authenticate,
  postAuthenticate: authconfig.postAuthenticate,
  disconnect: authconfig.disconnect,
  timeout: 1000
})

// module.exports = function (server) {
//   var io = socketio.listen(server)
//   var roomManager = new RoomManager(io)
//
//   io.on('connection', function (socket) {
//     socket.on('join', function (message) {
//       // attach room manager
//       roomManager.requestGameRoom(socket)
//     })
//
//     socket.on('disconnect', function () {
//       console.log('Client has disconnected: ' + socket.id)
//       roomManager.userDisconnect(socket)
//     })
//   })
// }

module.exports = function (server) {
  var io = socketio.listen(server)

  io.on('connection', function (socket) {
    socket.on('join', function (message) {
    })

    socket.on('chat message', function (msg) {
      io.emit('chat message', msg)
    })

    socket.on('disconnect', function () {
      console.log('Client has disconnected: ' + socket.id)
    })
  })
}
