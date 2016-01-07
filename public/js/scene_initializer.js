scene = new THREE.Scene();
$(function(e){
//Creation of scene, camera, renderer, geometry, material an meshes
var geometry = new THREE.BoxGeometry( 10, 10, 10 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

/* ***********************
	SPHERE OBJECT
************************ */
/* // create the sphere's material
var sphereMaterial =
	new THREE.MeshPhongMaterial(
		{
			color: 0xCC0000
		}); */
// set the sphere's properties		
/* var radius = 10,
		segments = 16,
		rings = 16;
var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			radius,
			segments,
			rings),
		sphereMaterial); */

// Adding mesh to scene
/* sphere.position.setX(0);
sphere.position.setY(10);
sphere.position.setZ(-50);
scene.add( sphere ); */

//Setting camera position
camera.position.x = -5;
camera.position.y = 5;
camera.position.z = 5;
/*camera.position.x = -30;
camera.position.y = 1;
camera.position.z = 1; 
*/
/* camera.lookAt( sphere ); */

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

/* ***********************
	CHARACTER
************************ */	

/* var foo = new Character();
foo.position.setX(0);
foo.position.setY(0);
foo.position.setZ(-40);
foo.scene.add( foo );  */

}); 