const chatForm = document.getElementById('chat-form')
const msg = document.getElementById('msg')
const chatDiv = document.querySelector('.chat-messages')
const usersList = document.getElementById("users")

// Retrieve username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

// Join chatroom
socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    outputRoomUsers(room, users)
})

// Message submit from client
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('chatMessage', msg.value)
    msg.value = ''
    msg.focus();
})

//  Receiving message from server
socket.on('message', (msg) => {
    displayMessage(msg)
    chatDiv.scrollTop = chatDiv.scrollHeight;
})

socket.on('type', (res) => {
    document.getElementById('typing').innerHTML = res
})

function displayMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${msg.username}<span>&nbsp;&nbsp;&nbsp;&nbsp;${msg.time}</span></p>
	    <p class="text">${msg.text}</p>
    `
    chatDiv.appendChild(div)
}

function outputRoomUsers(room, users) {
    document.getElementById('room-name').innerText = room;
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
}

function onkeyFn() {
    socket.emit('starttype', `${username} is typing...`)
    setTimeout(() => {
        socket.emit('stoptype', "")
    }, 2000);
}