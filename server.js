var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	swig = swig = require('swig'),
	util = require('util'),
	Player = require("./Player").Player,
	players;
	
// Database connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodegame');
	
function init(){
	players = [];
	setEventHandlers();
}

// Gestion d'évènements
var setEventHandlers = function() {
    io.on("connection", onSocketConnection);
};

// Rendre la base de données accessible au routeur
app.use(function(req,res,next){
    req.db = db;
    next();
});

//Templating system - SWIG  http://paularmstrong.github.io/swig/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.get('/', function(req, res, next) {  
	//Accéder à la base de données
	var db = req.db;
	var collection = db.get('usercollection');
	console.log("collection")
	var user_data = collection.find({},{},function(e,docs){
        console.log(e);
        console.log(docs);
	})
	res.render('index', { /* template locals context */ });
});

app.post('/', function (req, res) {
  res.send('Got a POST request');
	console.log("got a post request")
});


onSocketConnection = function (client) {  
	console.log('Client connected...');
	util.log("New player has connected: "+client.id);
	client.on('join', function(data) {
		/* console.log(data); */
	});
	client.on("disconnect", onClientDisconnect);
	//client.on("new player", onNewPlayer);
	client.on("move player", onMovePlayer);
	client.on('char_created', onNewPlayer);
	client.on('new_local', showPlayers);
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
/* ********************************
	Création et broadcast d'un nouveau joueur
********************************* */
onNewPlayer = function(data) {
	var collection = db.get('usercollection');
	collection.insert({name:data.name, id:this.id, x:0, y:0, z:-40});
	this.emit('new_local_char', {name:data.name, id:this.id});
	this.broadcast.emit('new_char', {name:data.name, id:this.id, x:0, y:0, z:-40});
	var newPlayer = new Player(data.x, data.y, data.z, this.id, data.name);
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

/* ********************************
	Afficher les personnages déjà présents
********************************* */

showPlayers = function(data){
	var collection = db.get('usercollection');
	var ceci = this;
	util.log(collection.find());
	collection.find( {}, { stream: true } ).each(
		function(e){
			ceci.broadcast.emit('new_char', {name:e.name, id:e.id, x:e.x, y:e.y, z:-e.z});
		}
	)
}

/* ********************************
	Déplacement du joueur local
********************************* */
onMovePlayer = function(data) {
	var movePlayer = playerById(data.id);
	var collection = db.get('usercollection');
	collection.update(
		{ id: data.id },
		{
			id: data.id,
			name: data.name,
			x:data.x, 
			y:data.y, 
			z:data.z	
		}
	)
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setZ(data.z);
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), z: movePlayer.getZ()});
};

/* ********************************
	Suppression du joueur
********************************* */
onRemovePlayer = function(data){
	var removePlayer = playerById(this.id);
	
	if (!removePlayer) {
			util.log("Player not found: "+this.id);
			return;
	};

	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id: this.id});
}

/* ********************************
	Déconnexion du joueur
********************************* */
onClientDisconnect = function() {
    util.log("Player has disconnected: "+this.id);
	var collection = db.get('usercollection');
	collection.remove({id: this.id});
};

init();
server.listen(8080)