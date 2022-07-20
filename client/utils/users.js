const users = []

// Join user to chat
const userJoin = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)
    return user
}

// Get current user
const getCurrentUser = (currId) => {
    return users.find(user => user.id == currId)
}

// User leaves the chat
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        const leftUser = users[index]
        users.splice(index, 1)
        return leftUser
    }
}

// Get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.room == room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}