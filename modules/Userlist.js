function Userlist() {
    // Properties
    var User = require('./Model/User');
    var userlist = {};


    // Methods
    this.newUser = function (username, socket) {
        userlist[username] = new User();
        userlist[username].setName(username);
        userlist[username].setSocket(socket);
        userlist[username].setIp(socket.request.connection.remoteAddress);
        userlist[username].setTime(new Date());
    };
    this.removeUser = function (username) {
        if (this.userExists(username)) {
            delete userlist[username];
        }
    };
    this.sendToUser = function (fromUsername, toUsername, message) {
        var whisperService = requeire('./Service/Whisper');
        whisperService.sendMessage(userlist[fromUsername], userlist[toUsername], message);
        whisperService = null;
    };
    this.userExists = function (username) {
        return (typeof userlist[username] != 'undefined');
    };
    this.getUserList = function () {
        return Object.keys(userlist);
    };
    this.pong = function(username) {
        if (this.userExists(username)) {
            userlist[username].setTime(new Date());
        }
    };
    this.getPong = function(username) {
        if (this.userExists(username)) {
            return userlist[username].getTime();
        }
        return null;
    };
    this.getUser = function(username) {
        return userlist[username];
    }
}
module.exports = Userlist;