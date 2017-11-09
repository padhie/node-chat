function SocketDataCreater() {
    this.createMessage = function (user, message) {
        return {zeit: new Date(), name: user.getName(), text: message};
    };

    this.createJoin = function(user) {
        return {zeit: new Date(), name: user.getName(), status: "JOINED"};
    };

    this.createUserList = function(userlist) {
        return {zeit: new Date(), status: "USERLIST", users: userlist.getUserList()};
    };

    this.createPing = function() {
        return {zeit: new Date(), status: 'PING'};
    };

    this.createLeft = function(user) {
        return {zeit: new Date(), name: user.getName(), status: "LEFT"};
    };

    this.createLoginMessage = function(message) {
        return {zeit: new Date(), text: message};
    };

}

module.exports = SocketDataCreater;