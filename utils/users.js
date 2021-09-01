const users = []

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user)
    return user
}

// Get current user
function getCurrentUser(currId) {
    return users.find(user => user.id == currId)
}

// User leaves the chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        const leftUser = users[index];
        users.splice(index, 1);
        return leftUser;
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room == room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}