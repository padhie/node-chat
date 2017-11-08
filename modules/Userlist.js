function Userlist() {
    // Properties
    var userlist = {};


    // Constuctor


    // Methods
    this.newUser = function (user, socket) {
        userlist[user] = {zeit: new Date(), name: user, socket: socket};
    };
    this.removeUser = function (user) {
        if (this.userExists(user)) {
            delete userlist[user];
        }
    };
    this.sendToUser = function (user, message) {
        userlist[user].socket.emit("chat", {zeit: new Date(), name: user, text: message, whisper: 1});
    };
    this.userExists = function (user) {
        return (typeof userlist[user] != 'undefined');
    };
    this.getUserList = function () {
        return userlist.keys();
    };
    this.pong = function(user) {
        if (this.userExists(user)) {
            userlist[user].zeit = new Date();
        }
    };
    this.getPong = function(user) {
        if (this.userExists(user)) {
            return userlist[user].zeit
        }
        return null;
    }

}
module.exports = Userlist;