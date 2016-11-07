var express = require('express'),
	app = express(),
	server = require('http').createServer(app), 
	io = require('socket.io').listen(server),
	conf = require('./config.json'),
	net = require("net");

// Userliste
var userlist = {};

// Webserver
// auf den Port x schalten
server.listen(conf.port);

app.configure(function(){
	// statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

// Websocket
io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	socket.emit('chat', {zeit:new Date(), text:'Du bist nun mit dem Server verbunden!'});

	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		if (typeof data.target != "undefined") {
			if (typeof userlist[data.target] != "undefined") {
				userlist[data.name].socket.emit("chat", {zeit:new Date(), name:data.name, text:data.text, whisper:1});
				userlist[data.target].socket.emit("chat", {zeit:new Date(), name:data.name, text:data.text, whisper:1});
			}
		} else {
			// so wird dieser Text an alle anderen Benutzer gesendet
			io.sockets.emit('chat', {zeit:new Date(), name:data.name, text:data.text});
		}
	});

	socket.on("status", function(data) {
		if (data.status=="JOIN") {
			io.sockets.emit('status', {zeit:new Date(), name:data.name, status:"JOINED"});
			userlist[data.name] = {zeit:new Date(), name:data.name, socket:socket};

			var users = [];
			for (var key in userlist) {
				users.push(key);
			}
			io.sockets.emit('status', {zeit:new Date(), name:data.name, status:"USERLIST", users:users});
		}

		if (userlist[data.name] != undefined) {
			if (data.status=="PONG") {
				userlist[data.name].zeit = new Date();
			}
		}
	});

	// Wenn ein benutzer den Chat verlässt
	socket.on('disconnect', function (data) {
		io.sockets.emit('status', {zeit: new Date(), status:'PING'});
		setTimeout(function(){
			var now = new Date();
			for (var key in userlist) {
				var userZeit = userlist[key].zeit;
				if (userZeit.getTime() < (now.getTime()-conf.pongCheck)) {
					io.sockets.emit("status", {zeit:new Date(), name:key, status:"LEFT"});
					delete userlist[key];
				}
			}
		}, conf.pongCheck);
	});
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');
