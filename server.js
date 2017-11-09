var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    conf = require('./config.json'),
    net = require("net"),
    Database = require("./Modules/Database"),
    Userlist = require('./Modules/Userlist'),
    SocketDataCreater = require('./Modules/Service/SocketDataCreater');

// Init objects
var dbConnection = new Database();
var user = new Userlist();
var sdc = new SocketDataCreater();


// Webserver
// auf den Port x schalten
server.listen(conf.portChat);

app.configure(function () {
    // statische Dateien ausliefern
    app.use(express.static(__dirname + '/public'));
});

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
    // so wird die Datei index.html ausgegeben
    res.sendfile(__dirname + '/public/index.html');
});

// Wenn Datenbank genutzt werden soll
if (typeof conf.useDB != 'undfined' && conf.useDB == true) {
    dbConnection.setConfig({
        host: conf.dbHost,
        user: conf.dbUser,
        password: conf.dbPassword,
        database: conf.dbDatabase
    });
    dbConnection.connect();
}

// Websocket
io.sockets.on('connection', function (socket) {

    // der Client ist verbunden
    socket.emit('chat', sdc.createLoginMessage(conf.loginMsg));

    // wenn ein Benutzer einen Text senden
    socket.on('chat', function (data) {
        if (typeof data.target != "undefined") {
            if (user.userExists(data.target)) {
                user.sendToUser(data.name, data.target, data.text);
                dbConnection.insert("INSERT INTO `chathistory` SET " +
                    "`user`='"+data.name+"'," +
                    "`target`='"+data.target+"',"+
                    "`message`='"+data.text+"'," +
                    "`time`=NOW()");
            }
        } else {
            // so wird dieser Text an alle anderen Benutzer gesendet
            io.sockets.emit('chat', sdc.createMessage(user.getUser(data.name), data.text));
            dbConnection.insert("INSERT INTO `chathistory` SET " +
                "`user`='"+data.name+"'," +
                "`target`='"+data.target+"',"+
                "`message`='"+data.text+"'," +
                "`time`=NOW()");
        }
    });

    // wenn statusmeldungen rein kommen
    socket.on("status", function (data) {
        if (data.status == "JOIN") {
            user.newUser(data.name, socket);
            io.sockets.emit('status', sdc.createJoin(user.getUser(data.name)));
            io.sockets.emit('status', sdc.createUserList(user));
        }

        if (data.status == "PONG") {
            user.pong(data.name);
        }
    });

    // Wenn ein benutzer den Chat verlässt
    socket.on('disconnect', function (data) {
        io.sockets.emit('status', sdc.createPing());
        setTimeout(function () {
            var now = new Date();
            var userlist = user.getUserList();
            for (var key in userlist) {
                var username = userlist[key];
                var userZeit = user.getPong(username);
                if (userZeit.getTime() < (now.getTime() - conf.pongCheck)) {
                    io.sockets.emit("status", sdc.createLeft(user.getUser(username)));
                    user.removeUser(username);
                }
            }
        }, conf.pongCheck);
    });
});

// Connection from outsite
var netServer = net.createServer(function (socket) {
    socket.on('data', function (data) {
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        io.sockets.emit('chat', {zeit: new Date(), name: "OUTSITE", text: data.text});
    });
}).listen(conf.portOutsite, '127.0.0.1');

// Portnummer in die Konsole schreiben
console.log('Chat is running on http://127.0.0.1:' + conf.portChat + '/');
console.log('Data is running on http://127.0.0.1:' + conf.portOutsite + '/');
