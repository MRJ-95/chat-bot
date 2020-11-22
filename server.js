const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const PORT = 4000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Import our modules
const {formatMessage} = require('./utils/messages')
const {userJoins, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users')

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'VES BOT'

// Runs when client conncets
io.on('connection', (socket) => {
  socket.on('joinRoom', ({username, room}) =>{
    const user = userJoins(socket.id, username, room)

    socket.join(user.room)

    socket.emit('message', formatMessage(botName ,'Welcome to chat'));

    // Broadcast when user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined`));

    //Get room and users info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

  });

  // Runs when user disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id)

    if(user){
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`));

      //Get room and users info
      io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
    }

  })

  // Listen for chat msg
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    // console.log(msg)
    io.emit('message', formatMessage(user.username, msg));
  })
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})