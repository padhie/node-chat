function User() {
    var _name = null;
    var _time = null;
    var _socket = null;
    var _ip = null;

    this.setName = function(name) {
        _name = name;
    };
    this.getName = function() {
        return _name;
    };
    this.setTime = function(time) {
        _time = time;
    };
    this.getTime = function() {
        return _time;
    };
    this.setSocket = function(socket) {
        _socket = socket;
    };
    this.getSocket = function() {
        return _socket;
    };
    this.setIp = function(ip) {
        _ip = ip;
    };
    this.getIp = function() {
        return _id;
    };
}

module.exports = User;