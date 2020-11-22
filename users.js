const users = []

//When the user joins
function userJoins(id, username, room){
    const user = {id, username, room}

    users.push(user)

    return user;
}

//To get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

//This is to determine which user has left
function userLeaves(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//To get all the active users in a room
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoins,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}
