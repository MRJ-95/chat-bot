const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//This code segement iss for recording the username and the room
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

//Join chatroom
socket.emit('joinRoom', ({username, room}))

//get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room)
  outputUsers(users)
})

socket.on('message', (message) => {
  console.log(message)
  outputMessage(message)

  // scroll
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get msg
  const msg = e.target.elements.msg.value
  //console.log(msg)

  // Emit message to server
  socket.emit('chatMessage', msg)

  // clear input
  e.target.elements.msg.value = ''
})

// Output Message to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

//For room name
function outputRoomName(room){
  roomName.innerText = room
}

//For displaying a list of users
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join(``)}
  `;
}