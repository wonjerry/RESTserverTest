var Game = require('./chatroom')
var debug = require('debug')('Rellat:RoomManager')
var MAX_CLIENT = 7

function RoomManager (socketio) {
  var self = this
  if (!(self instanceof RoomManager)) return new RoomManager(socketio)

  self.gameRooms = {}
  self.sockets = []
  self.io = socketio
}

RoomManager.prototype.requestGameRoom = function (socket) {
  var self = this
  if (!self.sockets.contains(socket)) { self.sockets.push(socket) }
  var hasJoined = false
  // 순차적으로 빈 방이 있는지 확인, MAX_CLIENT 확인
  for (var key in self.gameRooms) {
    if (self.gameRooms.hasOwnProperty(key)) {
      var gameroom = self.gameRooms[key]

      if (gameroom.players.length > MAX_CLIENT) continue

      socket.join(key)
      gameroom.pushClient({id: socket.id, money_on_hand: 100})
      hasJoined = true
    }
  }

  // 준비된 방이 없으면 새로 만든다.
  if (!hasJoined) { self.createGameRoom(socket) }

  // 게임 이벤트 핸들러를 바인딩한다.
  socket.on('game packet', function (message) {
    var gameroom = self.gameRooms[message.room_id]
    gameroom.clientEventHandler(message)
  })
}

RoomManager.prototype.createGameRoom = function (socket) {
  var self = this

  var gameroom = new Game({room_id: Math.random().toString(36).substr(2), num_of_decks: 1})
  gameroom.initGame()
  gameroom.pushClient({id: socket.id, money_on_hand: 100})
  socket.join(gameroom.room_id)
  gameroom.on('userleave', self.leaveGameRoom.bind(self))
  gameroom.on('response', self.roomResponse.bind(self))

  self.gameRooms[gameroom.room_id] = gameroom
}
RoomManager.prototype.leaveGameRoom = function (message) {
  var self = this
  var socket = self.io.sockets.connected[message.client_id]
  socket.leave(message.room_id)

  if (message.room_is_empty) delete self.gameRooms[message.room_id]
  self.requestGameRoom(socket)
}
RoomManager.prototype.roomResponse = function (message) {
  var self = this
  if (message.broadcast) {
    self.io.in(message.room_id).emit('game packet', message)
  } else {
    self.io.to(message.client_id).emit('game packet', message)
  }
}
RoomManager.prototype.userDisconnect = function (socket) {
  var self = this
  var rooms = self.io.sockets.adapter.rooms
  debug('Rooms: ' + JSON.stringify(rooms))
  for (var key in rooms) {
    if (rooms.hasOwnProperty(key)) {
      if (self.gameRooms[key]) {
        if (self.gameRooms[key].players[socket.id]) {
          self.gameRooms[key].updateDisconectedUser(socket.id)
        }
      }
    }
  }
}

// How do I check if an array includes an object in JavaScript?
// https://stackoverflow.com/questions/237104/how-do-i-check-if-an-array-includes-an-object-in-javascript
Array.prototype.contains = function (obj) {
  var i = this.length
  while (i--) {
    if (this[i] === obj) {
      return true
    }
  }
  return false
}

module.exports = RoomManager
