"use strict";
/* 
	La fonction autoexecutante reçoit en paramètre l'espace de nom
	G = MONAPP
*/

var GAME = GAME || {};

(function(G){
var socket = io.connect();
//Initialisation des variables
var localCharacter = null,
		players = [];
var canvas = document.getElementById("webgl");
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);
// Initialise keyboard controls
var keys = new Keys();
// Initialise scene
var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("camera1", 13,  Math.PI/4, 20, new BABYLON.Vector3(75, window.innerWidth / window.innerHeight, 0.1), scene);

/* **********************
	Initialisation de la scène
*********************** */
function init(scene) {
	/* ***********************
		RENDERING
	************************ */	
		 // This begins the creation of a function that we will 'call' just after it's built
		var createScene = function () {

		// Change the scene background color to green.
		scene.clearColor = new BABYLON.Color3(0, 1, 0);

		// This targets the camera to scene origin
		camera.setTarget(BABYLON.Vector3.Zero());

		// This attaches the camera to the canvas
		camera.attachControl(canvas, false);

		// This creates a light, aiming 0,1,0 - to the sky.
		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

		// Dim the light a small amount
		light.intensity = .5;

		// Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
		var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

		// Move the sphere upward 1/2 its height
		sphere.position.y = 1;

		// Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
		var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
		
		// Skybox
		var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skybox/city", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skybox.material = skyboxMaterial;
		
		var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
		light0.diffuse = new BABYLON.Color3(1, 1, 1);
		light0.specular = new BABYLON.Color3(1, 1, 1);
		light0.groundColor = new BABYLON.Color3(0, 0, 0);

		// Leave this function
		return scene;

	  };  // End of createScene function
	  
	  var scene = createScene();
	  engine.runRenderLoop(function () {
		if(localCharacter != null){	
			//camera.setTarget(localCharacter.position);
			if(localCharacter.move(keys)){
				socket.emit("move player", {id:localCharacter.id, x: localCharacter.position.x, y: localCharacter.position.y, z: localCharacter.position.z});
			}
		}
		scene.render();
	  });
	  window.addEventListener("resize", function () {
		engine.resize();
	  });
	};
	/* **********************
		Déplacements
	*********************** */
	var setMoveHandlers = function() {
		$(document).on("keydown", function(e){keys.onKeyDown(e)});
		$(document).on("keyup", function(e){keys.onKeyUp(e)});
	};
		
	function onSocketConnected() {
			console.log("Connected to socket server");
	};

	function onSocketDisconnect() {
			console.log("Disconnected from socket server");
	};

	function onNewPlayer(data) {
			console.log("New player connected: "+data.id);
	};

	function playerById(id) {
		var i;
		for (i = 0; i < players.length; i++) {
			if (players[i].id == id)
				return players[i];
		};
		return false;
	};

	function onMovePlayer(data) {
		var movingP = playerById(data.id);
		movingP.position.x = data.x;
		movingP.position.y = data.y;
		movingP.position.z = data.z;
	};

	function onRemovePlayer(data) {
		console.log("Player Removed: "+data.id);
	};

	function createPlayer(data, scene){
		var player = new Player(scene);
		player.position.x = data.x;
		player.position.y = data.y;
		player.position.z = data.z;
		//scene.add( player ); 
		player.name = data.name;
		// Start listening for move events
		setMoveHandlers();
		player.id = data.id;
		players.push( player );
	};

	//Socket listeners
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
	socket.on('broad', function(data) {
			$('#future').html(data);
	 });

	 $('#form').submit(function(e){
			 e.preventDefault();
			 var message = $('#chat_input').val();
			 socket.emit('messages', message);
	 });
	 
	 $('#new_char').submit(function(e){
			e.preventDefault();
			var nom = $('#char_input').val();
			socket.emit('char_created', {name:$('#char_input').val(), x:0, y:0, z:-40});
	 });
	 
	// New local player
	socket.on('new_local_char', function(data){
		//Créer le personnage
		localCharacter = new Player(scene);
		//Attacher le personnage à la caméra
		camera.target = localCharacter;
		camera.lowerAlphaLimit  = -0.3;
		camera.upperAlphaLimit = 0.3;
		localCharacter.position.x = 0;
		localCharacter.position.y = 0;
		localCharacter.position.z = -40;
		// scene.add( localCharacter ); 
		localCharacter.name = data.name;
		localCharacter.id = data.id;
		// Start listening for move events
		setMoveHandlers();
	});

	// New outside player
	socket.on('new_char', function(data) {
		createPlayer(data, scene);
	});
	
	//Initialiser la scène
	$(document).ready(function(e) { 
		init(scene);
	});	
	
	//Set game vars
	G.localCharacter = localCharacter;
}(GAME))
