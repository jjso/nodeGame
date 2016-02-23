scene = new THREE.Scene();
$(function(e){
//Creation of scene, camera, renderer, geometry, material an meshes
var geometry = new THREE.BoxGeometry( 10, 10, 10 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

/* ***********************
	SPHERE OBJECT
************************ */

//Setting camera position
camera.position.x = -5;
camera.position.y = 5;
camera.position.z = 5;

/* ***********************
	AXIS HELPER
************************ */	
axes = new THREE.AxisHelper( 1000 );
scene.add( axes );

//Grille
var size = 100;
var step = 1;

var gridHelper = new THREE.GridHelper( size, step );
scene.add( gridHelper );

/* ***********************
	LIGHT
************************ */	
var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add( light );

}); 