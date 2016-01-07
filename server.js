var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	swig = swig = require('swig'),
	util = require('util'),
	Player = require("./Player").Player,
	players;
	
function init(){
	players = [];
	setEventHandlers();
}

// Gestion d'évènements
var setEventHandlers = function() {
    io.on("connection", onSocketConnection);
};

// Send client html.
/* app.get('/', function(req, res) {
    res.sendfile(__dirname + '/3d.html')
})  */

//Templating system - SWIG  http://paularmstrong.github.io/swig/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {  
    //res.sendFile(__dirname + '/index.html');
		res.render('index', { test: 'ALLO' });
});
app.post('/', function (req, res) {
  res.send('Got a POST request');
	console.log("got a post request")
});



onSocketConnection = function (client) {  
	console.log('Client connected...');
	util.log("New player has connected: "+client.id);
	client.on('join', function(data) {
			console.log(data);
	});
	client.on("disconnect", onClientDisconnect);
	//client.on("new player", onNewPlayer);
	client.on("move player", onMovePlayer);
	client.on('char_created', onNewPlayer)
	//Chat 
	client.on('messages', function(data) {
		 client.emit('broad', data);
		 client.broadcast.emit('broad',data);
	});
}

function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
				return players[i];
	};
	return false;
};

onNewPlayer = function(data) {
/* 	util.log("data.id");
	util.log(data.id);
	util.log(this.id); */
	io.emit('new_local_char', {name:data, id:this.id});
	this.broadcast.emit('new_char', {name:data, id:this.id, x:0, y:0, z:-40});
	var newPlayer = new Player(data.x, data.y, data.z, this.id);
	//newPlayer.id = data.id;
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), z: newPlayer.getZ()});
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		//this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};
	players.push(newPlayer);
	util.log("players");
	util.log(players);
};

onMovePlayer = function(data) {
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	
/* 	util.log("data.x");
	util.log(data.x); */
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setZ(data.z);
	util.log(movePlayer.getX());
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), z: movePlayer.getZ()});
};

onRemovePlayer = function(data){
	var removePlayer = playerById(this.id);

	if (!removePlayer) {
			util.log("Player not found: "+this.id);
			return;
	};

	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id: this.id});
}

onClientDisconnect = function() {
    util.log("Player has disconnected: "+this.id);
};

init();
server.listen(8080)