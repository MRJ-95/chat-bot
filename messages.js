const moment = require('moment');

//To store and format the message
function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = {
    formatMessage
}
